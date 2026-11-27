# NEXUS SECURITY AI

<p align="center">
  <img src="assets/nexus-logo.svg" alt="NEXUS SECURITY AI logo" width="420">
</p>

<p align="center"><strong>Defensive Security Operations • Asset Inventory • Event Review • Incident Management</strong></p>

منصة مستقلة لإدارة عمليات الأمن الدفاعي، بهوية NEXUS الداكنة والأزرق الكهربائي.

## الإصدار الحالي: V2 Foundation
- لوحة عمليات تلخص الأصول والحوادث والضوابط.
- جرد أصول مع إضافة وحذف وبحث محلي.
- مراجعة سجلات نصية محلية بمؤشرات واضحة ومحدودة.
- إدارة حوادث بمراحل: مفتوح، قيد المعالجة، مغلق.
- قائمة تحقق لضوابط الحماية الأساسية.
- مساعد معرفي محلي لمفاهيم الأمن الدفاعي.
- تقارير TXT وJSON.
- سجل تدقيق محلي للعمليات.
- واجهة عربية RTL ومتجاوبة مع الهاتف والكمبيوتر.

## هيكل المشروع
```
.
├── assets/
│   └── nexus-logo.svg
├── docs/
│   └── ARCHITECTURE.md
├── app.js
├── index.html
├── styles.css
├── SECURITY.md
├── README.md
└── LICENSE
```

## النشر على Vercel
استورد المستودع من GitHub، ثم اختر **Framework Preset: Other**، واترك **Build Command** فارغاً، وعيّن **Output Directory** إلى `.`. لا يحتاج هذا الإصدار إلى Python أو قاعدة بيانات أو متغيرات بيئة.

للتجربة المباشرة، استخدم فرع `release/v2-foundation` عند الاستيراد أو أنشئ Preview Deployment لهذا الفرع.

## حدود الإصدار
هذا الإصدار يعمل محلياً داخل المتصفح ويحفظ البيانات في localStorage غير المشفر. لا يتصل بخادم أو نموذج AI. محلل السجلات يعتمد على كلمات مفتاحية ولا يؤكد وقوع حادث. لا تستخدمه لتخزين أسرار أو سجلات إنتاج حساسة.

## مبادئ المشروع
NEXUS مشروع مستقل يركز على الإدارة الدفاعية والمراجعة المصرح بها. لا يوفر استغلال ثغرات أو تنفيذ هجمات أو تخفياً أو سرقة بيانات اعتماد. راجع [SECURITY.md](SECURITY.md) و[معمارية المشروع](docs/ARCHITECTURE.md) قبل أي تطوير إضافي.
