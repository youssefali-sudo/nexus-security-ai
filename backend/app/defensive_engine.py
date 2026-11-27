"""Deterministic, local-only defensive event correlation for supplied log samples."""
from __future__ import annotations

import re
from collections import Counter
from typing import Any

EVENT_PATTERNS = [
    ("AUTH_FAILURE", "authentication", re.compile(r"LOGIN_FAILED|AUTH_FAILURE|AUTHENTICATION FAILED|INVALID_PASSWORD|LOGIN DENIED", re.I)),
    ("AUTH_SUCCESS", "authentication", re.compile(r"LOGIN_SUCCESS|AUTH_SUCCESS|LOGIN SUCCEEDED", re.I)),
    ("ACCESS_DENIED", "authorization", re.compile(r"ACCESS_DENIED|PERMISSION_DENIED|\bHTTP.?403\b", re.I)),
    ("MFA_DISABLED", "identity_control", re.compile(r"MFA_DISABLED|2FA_DISABLED|MULTI.?FACTOR DISABLED", re.I)),
    ("PRIVILEGE_CHANGE", "privilege", re.compile(r"PRIVILEGE_ESCALATION|ROLE_CHANGED|ADMIN_GRANTED|SUDO_SESSION", re.I)),
    ("MALWARE_ALERT", "endpoint", re.compile(r"MALWARE_DETECTED|QUARANTINE_ALERT|EDR_THREAT", re.I)),
    ("SERVICE_ERROR", "availability", re.compile(r"SERVICE_UNAVAILABLE|CONNECTION_REFUSED|\bTIMEOUT\b", re.I)),
    ("WEAK_CONFIGURATION", "configuration", re.compile(r"DEBUG_MODE_ENABLED|DEFAULT_CREDENTIALS_CONFIGURED|TLS_VERIFICATION_DISABLED", re.I)),
]

SEVERITY_RANK = {"info": 0, "low": 1, "medium": 2, "high": 3, "critical": 4}


def analyze_events(text: str, source_label: str = "user-supplied sample") -> dict[str, Any]:
    """Analyze caller-supplied text without executing, storing, or returning raw log lines."""
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    counts: Counter[str] = Counter()
    categories: Counter[str] = Counter()
    auth_failure_positions: list[int] = []
    auth_success_positions: list[int] = []

    for index, line in enumerate(lines):
        for event_code, category, pattern in EVENT_PATTERNS:
            if pattern.search(line):
                counts[event_code] += 1
                categories[category] += 1
                if event_code == "AUTH_FAILURE":
                    auth_failure_positions.append(index)
                elif event_code == "AUTH_SUCCESS":
                    auth_success_positions.append(index)
                break

    findings: list[dict[str, Any]] = []
    def add(code: str, severity: str, title: str, detail: str, recommendation: str, count: int = 1) -> None:
        findings.append({
            "id": code.lower(),
            "code": code,
            "severity": severity,
            "title": title,
            "detail": detail,
            "recommendation": recommendation,
            "count": count,
        })

    if counts["AUTH_FAILURE"]:
        severity = "high" if counts["AUTH_FAILURE"] >= 5 else "medium"
        add("AUTH_FAILURES", severity, "محاولات مصادقة فاشلة",
            f"تم رصد {counts['AUTH_FAILURE']} حدث فشل مصادقة في العينة.",
            "راجع الحسابات المتأثرة وسياسة كلمات المرور والمصادقة متعددة العوامل.",
            counts["AUTH_FAILURE"])
    if auth_failure_positions and auth_success_positions and min(auth_success_positions) > min(auth_failure_positions):
        add("FAILURE_THEN_SUCCESS", "high", "نجاح دخول بعد إخفاقات",
            "توجد أحداث نجاح مصادقة بعد أحداث فشل في نفس العينة؛ يلزم التحقق من سياق الحساب.",
            "تحقق من سجل الحساب والجلسة ومصدر الدخول من السجلات المصرح بها.")
    if counts["MFA_DISABLED"]:
        add("MFA_DISABLED", "high", "تعطيل المصادقة متعددة العوامل",
            "تتضمن العينة حدثاً يشير إلى تعطيل MFA.",
            "تحقق من أن التغيير معتمد وأعد تفعيل الضابط عند عدم وجود مبرر.")
    if counts["PRIVILEGE_CHANGE"]:
        add("PRIVILEGE_CHANGE", "high", "تغيير امتيازات",
            "تتضمن العينة تغيير دور أو منح صلاحية مرتفعة.",
            "راجع طلب الموافقة وهوية المنفذ ونطاق الصلاحيات.", counts["PRIVILEGE_CHANGE"])
    if counts["MALWARE_ALERT"]:
        add("ENDPOINT_ALERT", "critical", "تنبيه حماية طرفية",
            "تتضمن العينة مؤشراً من نظام حماية طرفية.",
            "اتبع إجراءات الاستجابة المعتمدة وراجع تنبيه أداة الحماية الأصلية.", counts["MALWARE_ALERT"])
    if counts["ACCESS_DENIED"] >= 5:
        add("ACCESS_DENIED_BURST", "medium", "تكرار رفض الوصول",
            f"تم رصد {counts['ACCESS_DENIED']} حالات رفض وصول.",
            "راجع الصلاحيات وسياق الطلبات وتأكد من عدم وجود إعداد خاطئ.", counts["ACCESS_DENIED"])
    if counts["WEAK_CONFIGURATION"]:
        add("CONFIGURATION_REVIEW", "medium", "إعداد يحتاج مراجعة",
            "تم رصد مؤشر إعداد قد يضعف الحماية.",
            "راجع إعدادات البيئة وأعد تفعيل الإعدادات الآمنة.", counts["WEAK_CONFIGURATION"])
    if counts["SERVICE_ERROR"] >= 3:
        add("SERVICE_ERRORS", "low", "أخطاء توفر الخدمة",
            f"تم رصد {counts['SERVICE_ERROR']} أحداث أخطاء خدمة.",
            "راجع حالة الخدمة والاعتماديات ومؤشرات التوفر.", counts["SERVICE_ERROR"])

    weights = {"low": 8, "medium": 16, "high": 25, "critical": 35}
    risk_score = min(100, sum(weights[item["severity"]] for item in findings))
    overall = "critical" if risk_score >= 70 else "high" if risk_score >= 45 else "medium" if risk_score >= 20 else "low" if risk_score else "info"
    findings.sort(key=lambda item: (-SEVERITY_RANK[item["severity"]], item["code"]))

    return {
        "source_label": source_label,
        "lines_reviewed": len(lines),
        "event_counts": dict(sorted(counts.items())),
        "category_counts": dict(sorted(categories.items())),
        "finding_count": len(findings),
        "risk_score": risk_score,
        "risk_level": overall,
        "findings": findings,
        "disclaimer": "مؤشرات آلية أولية وليست إثباتاً لاختراق. تمت معالجة النص محلياً دون تشغيله أو تخزينه أو إعادة السطور الأصلية.",
    }
