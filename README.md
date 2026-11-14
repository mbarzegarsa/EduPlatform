# EduPlatform | پلتفرم یکپارچهٔ آموزشی

سامانهٔ ایستا (Static) برای خدمات مدارس: صدور گواهی، محاسبهٔ معدل، آلبوم کلاسی، کارت شمارهٔ صندلی و تحلیل مردودی.
بدون بک‌اند، بدون فرایند Build؛ فقط فایل‌های HTML/CSS/JS را باز کنید و اجرا شود.

[![Static](https://img.shields.io/badge/site-static-6366f1)](https://pages.github.com/)
[![Pages](https://img.shields.io/badge/deploy-GitHub_Pages-0ea5e9)](.github/workflows/static.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981)](LICENSE)
[![RTL](https://img.shields.io/badge/lang-fa_RTL-f59e0b)]()

> **مخزن پروژه:** <https://github.com/mbarzegarsa/EduPlatform>
> **نمونهٔ زنده (پس از فعال‌سازی Pages):** `https://mbarzegarsa.github.io/EduPlatform/`

---

## ماژول‌ها

| ماژول | مسیر | نسخه | کار |
|---|---|---|---|
| لندینگ | [`/`](./index.html) | یکپارچه | کارت ۵ سرویس + دانلود افزونه |
| صدور گواهی و نامه | [`/certificate`](./certificate/index.html) | ۵.۲.۰ | اشتغال به تحصیل + معافیت، اتصال سیدا، ۳ قالب چاپ |
| محاسبه‌گر معدل | [`/gpa-calculator`](./gpa-calculator/index.html) | ۳.۰.۰ | فرمول آموزش‌وپرورش `(م۱×۱ + پ۱×۲ + م۲×۱ + پ۲×۴) ÷ ۸`، تابستانی، شرط علمی |
| آلبوم کلاسی | [`/profile-downloader`](./profile-downloader/index.html) | ۳.۰ | دانلود پروفایل سیدا، چیدمان هوشمند؛ هر کلاس دقیقاً یک برگ A4 |
| شمارهٔ صندلی | [`/seat-number`](./seat-number/index.html) | ۱۴.۰ | شماره‌گذاری هوشمند، طراح کارت؛ هر کارت یک A4 افقی با نسبت `1.414` |
| تحلیل مردودی | [`/failedstudents`](./failedstudents/index.html) | — | PDF کارنامهٔ کلی + پیش‌نویس، CSV/Excel/چاپ A4 |
| افزونهٔ مرورگر | [`/extension.zip`](./extension.zip) | — | نصب روی کروم/اج + نسخهٔ فروشگاه فایرفاکس |

---

## ساختار پروژه

```text
.
├── index.html                  # لندینگ
├── certificate/                # گواهی (popup.css + popup.js)
├── gpa-calculator/             # معدل (gpa-calculator.css/js)
├── profile-downloader/         # آلبوم (style.css + script.js)
├── seat-number/                # صندلی (style.css + script.js)
├── failedstudents/             # مردودی (style.css + app.js + pdf.min.js)
├── extension.zip               # افزونهٔ کرومیوم
├── assets/css/edu-uniform.css  # لایهٔ یکدست‌ساز (سورس اصلی)
├── assets/js/edu-uniform.js    # فوتر مشترک قبلی/بعدی
├── font/Vazirmatn*.woff2       # فونت ریشه
└── .github/workflows/static.yml# دیپلوی Pages
```

> **دلیل تکرار دارایی‌ها:** هر زیرپوشه یک نسخهٔ محلی از `edu-uniform.css/js` و `assets/font/` دارد تا اجرای مستقیم از فایل (بدون سرور) و نیز انتشار در زیرمسیر GitHub Pages بدون شکستن مسیرها ممکن باشد.

---

## اجرای محلی

```bash
# روش ۱: اجرای مستقیم
xdg-open index.html          # در ویندوز: start index.html  |  در مک: open index.html

# روش ۲: سرور محلی (پیشنهادی؛ برای جلوگیری از محدودیت CORS در ماژول‌ها)
python3 -m http.server 8000
# سپس در مرورگر: http://localhost:8000
```

**پیش‌نیاز:** ندارد.
داده‌ها در `localStorage` ذخیره می‌شوند. اینترنت تنها برای بارگذاری فونت/آیکون از CDN لازم است؛ هستهٔ برنامه به‌صورت آفلاین نیز کار می‌کند.

---

## انتشار روی GitHub Pages

ورک‌فلوی آماده در [`.github/workflows/static.yml`](.github/workflows/static.yml) قرار دارد. با هر پوش روی شاخهٔ `main`، دیپلوی خودکار انجام می‌شود.

1. مخزن را بسازید و پوش کنید:

   ```bash
   git init -b main
   git add .
   git commit -m "EduPlatform release"
   git remote add origin https://github.com/mbarzegarsa/EduPlatform.git
   git push -u origin main
   ```

2. به مسیر **Settings → Pages → Source: GitHub Actions** بروید.
3. نشانی سایت ساخته می‌شود: `https://mbarzegarsa.github.io/EduPlatform/`.

> **نکتهٔ مسیرها:** همهٔ لینک‌ها نسبی نوشته شده‌اند (`./certificate` و نه `/certificate`) تا انتشار در زیرمسیر Pages دچار خطا نشود.

---

## افزونهٔ مرورگر

- **کرومیوم / اج:** فایل `extension.zip` را دانلود و استخراج کنید، به `chrome://extensions` بروید، گزینهٔ **Developer mode** را فعال کنید و روی **Load unpacked** بزنید.
- **فایرفاکس:** از فروشگاه نصب کنید (دکمهٔ لندینگ به‌طور خودکار تشخیص می‌دهد).
- **موبایل / تبلت:** پشتیبانی نمی‌شود؛ افزونه فقط روی دسکتاپ نصب می‌شود. لندینگ و پنجرهٔ راهنما نیز همین موضوع را اطلاع می‌دهند.

---

## یکدستی UI/UX

لایهٔ `edu-uniform v1.0.0` ظاهر را یکسان کرده است، بدون دست‌زدن به منطق برنامه:

- **هدر:** `min-height: 64px`، `padding: 16×32`، چیدمان `space-between` در هر ۶ صفحه.
- **فوتر:** ماژول‌های `certificate` و `gpa` به‌عنوان مدل مرجع انتخاب شدند. `seat-number` و `profile-downloader` نیز همان ساختار `footer-actions + navigation-buttons (#prevTabBtn/#nextTabBtn) + system-status` را گرفتند و جایگاه دکمه‌های قبلی/بعدی ثابت شد.
- **دکمه:** `padding: 12×20`، `radius: 10px`، `font-weight: 700`. رنگ برند هر ماژول حفظ شد.
- **`edu-uniform.js`:** تنها دکمه‌های دارای `data-edu-uniform` را سیم‌کشی می‌کند. هندلرهای `switchTab/previousTab/nextTab` در گواهی و معدل بازنویسی نشدند.
- **آیکون FontAwesome:** از قانون یکدست‌سازی فونت مستثنا شد تا نمایش آیکون‌ها نشکند.

---

## فونت وزیر

- **متن رابط کاربری:** `Vazirmatn` ← `Vazir` ← `Segoe UI/Tahoma`.
- **چاپ و پنجرهٔ چاپ** (`window.open().document.write`) نیز به `Vazirmatn` مجهز شد: `popup.js` (گواهی و نامه)، `seat-number/script.js`، `profile-downloader/script.js` و `gpa-calculator.js`.
- **فایل گمشدهٔ `Vazirmatn-Bold.woff2`** (در CSS/JS ارجاع داده شده بود اما فایل وجود نداشت و خطای 404 می‌داد) از `Vazirmatn.woff2` ساخته و در هر ۵ پوشهٔ `assets/font/` قرار گرفت.
- **`failedstudents`** بستهٔ وزنی کامل خود را دارد: `fonts/webfonts/Vazirmatn-*.woff2`.

---

## چاپ

| خروجی | اندازه | نکته |
|---|---|---|
| گواهی / نامه | A4 عمودی | ۳ قالب `official` / `simple` / `modern` |
| معدل | A4 | جدول تحلیل دروس |
| آلبوم | A4 عمودی | هر کلاس دقیقاً یک برگ |
| صندلی | A4 افقی | هر کارت یک برگ، نسبت `1.414` |
| مردودی | A4 عمودی، حاشیهٔ `6mm` | چند دانش‌آموز در هر برگ، `zoom` خودکار |

قاعدهٔ `print-color-adjust: exact` در همهٔ ماژول‌ها فعال شد تا رنگ چاپ با پیش‌نمایش یکسان باشد.

---

## فناوری‌های استفاده‌شده

| فناوری | نقش | مرجع |
|---|---|---|
| HTML5 / CSS3 / Vanilla JS | هستهٔ ایستا | [MDN Web Docs](https://developer.mozilla.org/) |
| SheetJS (xlsx) | خواندن/نوشتن Excel | <https://sheetjs.com/> |
| html2pdf / html2canvas / jsPDF | تولید PDF از DOM | <https://github.com/eKoopmans/html2pdf.js> |
| pdf.js | رندر و تحلیل PDF | <https://mozilla.github.io/pdf.js/> |
| persian-datepicker | انتخاب تاریخ شمسی | <https://github.com/Mds92/MD.BootstrapPersianDateTimePicker> |
| Font Awesome 6 | آیکون‌ها | <https://fontawesome.com/> |
| Vazirmatn | فونت فارسی | <https://github.com/rastikerdar/vazirmatn> |
| GitHub Pages | میزبانی ایستا | <https://pages.github.com/> |

---

## مجوز

این پروژه تحت [مجوز MIT](LICENSE) منتشر شده است — © ۲۰۲۶ mbarzegarsa.

---

## توسعه‌دهنده

طراحی و توسعه: [mbrzgrsa](https://t.me/mbrzgrsa)
برای گزارش باگ یا درخواست قابلیت جدید، یک [Issue](https://github.com/mbarzegarsa/EduPlatform/issues) باز کنید.
