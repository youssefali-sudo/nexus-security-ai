# NEXUS SECURITY AI

<p align="center"><img src="assets/nexus-logo.svg" alt="NEXUS SECURITY AI logo" width="420"></p>
<p align="center"><strong>Defensive Security Operations • Evidence-led Workflows • Incident Management</strong></p>

منصة مستقلة لإدارة عمليات الأمن الدفاعي، بهوية NEXUS الداكنة والأزرق الكهربائي.

## Foundation
- لوحة عمليات، جرد أصول، مراجعة سجلات، إدارة حوادث، ضوابط حماية، تقارير وسجل تدقيق محلي.
- مواصفات V3 للـ Workflow Engine وEvidence Ledger وApproval Desk وعلاقات الأصول وغرفة الحوادث.
- Backend تجريبي باستخدام FastAPI؛ راجع `backend/README.md`.

## V3.1 — Multi-language Defensive Review
يدعم سجل اللغات 24 لغة: **Go, TypeScript, JavaScript, Python, Rust, Java, C, C++, C#, PHP, Ruby, Swift, Kotlin, Dart, Lua, R, Perl, Scala, Bash, PowerShell, SQL, Elixir, Haskell, Zig.**

- `GET /api/v1/languages` يعرض اللغات والامتدادات.
- `POST /api/v1/reviews/source` يراجع الكود المرسل بحثاً عن مؤشرات نصية أولية مثل الأسرار المضمنة، تعطيل تحقق TLS، وبعض أنماط التقييم الديناميكي وتشغيل الأوامر وبناء SQL.
- التحليل ساكن ومحلي: لا يشغّل أو يترجم الكود ولا يتصل بأهداف أو خدمات خارجية، ولا يعيد نص المصدر.
- النتائج مؤشرات تقريبية تحتاج مراجعة بشرية؛ لا تثبت وجود ثغرة ولا تضمن سلامة الكود.

التفاصيل: [Multi-language Review](docs/MULTI_LANGUAGE_REVIEW.md).

## V3.2 — Defensive Event Correlation
- محرك تحليل دفاعي يربط مؤشرات المصادقة الفاشلة والناجحة، تعطيل MFA، تغييرات الامتيازات، تنبيهات الطرفيات، رفض الوصول، وأخطاء الخدمات.
- ترتيب النتائج حسب الخطورة مع درجة فرز إرشادية من 0 إلى 100 وتوصيات مراجعة.
- نقطة API: `POST /api/v1/analysis/defensive`، مع عرض متقدم داخل مساحة تحليل السجلات.
- التحليل محلي وحتمي؛ لا يشغّل المدخلات ولا يتصل بأهداف ولا يعيد السجلات الخام.

## Deployment and limitations
الواجهة تطبيق ثابت في جذر المشروع ويمكن ضبط Vercel على Framework Preset: Other وOutput Directory: `.`. الـ Backend غير جاهز للنشر العام: لا توجد مصادقة أو صلاحيات أو قاعدة بيانات أو عزل مستخدمين أو تحديد معدل الطلبات. لا ترفع أسراراً أو سجلات إنتاج أو شيفرات خاصة حساسة.

## Safety
NEXUS يركز على الإدارة الدفاعية والمراجعة المصرح بها. لا ينفذ استغلال ثغرات أو هجمات أو تخفياً أو جمع بيانات اعتماد أو فحص أهداف خارجية.
