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
