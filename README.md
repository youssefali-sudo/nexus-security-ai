# NEXUS SECURITY AI

<p align="center">
  <img src="assets/nexus-logo.svg" alt="NEXUS SECURITY AI logo" width="420">
</p>

<p align="center"><strong>Defensive Security Operations • Evidence-led Workflows • Incident Management</strong></p>

منصة مستقلة لإدارة عمليات الأمن الدفاعي، بهوية NEXUS الداكنة والأزرق الكهربائي.

## V2 Foundation — واجهة تجريبية
- لوحة عمليات تلخص الأصول والحوادث والضوابط.
- جرد أصول محلي مع البحث والإدارة.
- مراجعة نصوص سجلات محلية بمؤشرات محدودة.
- إدارة الحوادث وقائمة ضوابط الحماية.
- مساعد معرفي محلي غير متصل بنموذج AI.
- تقارير TXT وJSON وسجل تدقيق محلي.
- واجهة عربية RTL ومتجاوبة.

## V3 Defensive Platform — المعمارية الأولية
فرع `release/v3-defensive-platform` يضيف مواصفات هندسية للانتقال من الواجهة التجريبية إلى منصة متعددة المستخدمين:

- **Workflow Engine:** مهام مراجعة دفاعية ذات حالات واضحة وميزانيات وحدود زمنية.
- **Evidence Ledger:** مصدر وتوقيت وبصمة وسجل تنقيح لكل دليل.
- **Approval Desk:** موافقات بشرية قبل نشر التقارير أو الإجراءات الإدارية الحساسة.
- **Asset Relationships:** نموذج علاقات بين الأصول التي يملكها المستخدم أو يديرها.
- **Incident Room:** تسلسل زمني للحوادث والقرارات والمسؤوليات.
- **AI Copilot:** اقتراحات تفسيرية فقط، مع مراجعة بشرية إلزامية.
- **API Contract:** مواصفات OpenAPI أولية للخدمات الدفاعية.

### مستندات V3
- [Platform Blueprint](docs/PLATFORM_BLUEPRINT.md)
- [Workflow Engine](docs/WORKFLOW_ENGINE.md)
- [Data Model](docs/DATA_MODEL.md)
- [Security Model](docs/SECURITY_MODEL.md)
- [Test Plan](docs/TEST_PLAN.md)
- [Roadmap](docs/ROADMAP.md)
- [OpenAPI Contract](api/openapi.yaml)

## النشر على Vercel
الواجهة الحالية في جذر المشروع تطبيق ثابت؛ عند استيراد هذا الفرع في Vercel اختر **Framework Preset: Other**، واترك **Build Command** فارغاً، واجعل **Output Directory** هو `.`.

## الحالة والقيود
- V2 يعمل محلياً داخل المتصفح ويستخدم `localStorage` غير المشفر.
- V3 في هذا الفرع هو **مواصفات ومعمارية وعقد API أولي**؛ لم يتم تنفيذ Backend أو قاعدة بيانات أو مصادقة أو ربط AI بعد.
- تحليل السجلات الحالي قائم على أنماط نصية بسيطة، ولا يؤكد وقوع حادث.
- لا تستخدم النسخة الحالية لتخزين أسرار أو سجلات إنتاج حساسة.

## مبادئ السلامة
NEXUS مشروع مستقل يركز على الإدارة الدفاعية والمراجعة المصرح بها. لا ينفذ استغلال ثغرات أو هجمات أو تخفياً أو جمع بيانات اعتماد أو فحص أهداف خارجية. أي تكامل مستقبلي يجب أن يكون محدود الصلاحيات، للقراءة فقط افتراضياً، وقابلاً للتدقيق.
