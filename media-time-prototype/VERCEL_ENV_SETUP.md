# Vercel Environment Variables Setup

## المشكلة: "Google Sheets not configured"

إذا رأيت هذه الرسالة في Vercel (production)، فهذا يعني أن Environment Variable غير موجود في Vercel.

## الحل السريع:

### الخطوة 1: احصل على Web App URL

إذا كان لديك URL في `.env` محلياً:
```bash
cat .env | grep GOOGLE_SHEETS
```

أو من Google Apps Script:
1. افتح Google Sheet
2. Extensions → Apps Script
3. Deploy → Manage deployments
4. انسخ Web App URL

### الخطوة 2: أضف Environment Variable في Vercel

1. **اذهب إلى Vercel Dashboard**
   - https://vercel.com/dashboard
   - اختر مشروعك

2. **Settings → Environment Variables**

3. **أضف Variable جديد:**
   - **Name**: `VITE_GOOGLE_SHEETS_WEB_APP_URL`
   - **Value**: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`
   - **Environment**: اختر **Production**, **Preview**, و **Development** (أو جميعها)

4. **احفظ**

### الخطوة 3: أعد النشر

بعد إضافة Environment Variable:
- Vercel سيعيد النشر تلقائياً
- أو يمكنك إعادة النشر يدوياً من Deployments

## التحقق من الإعداد:

### في Browser Console (في Vercel site):
افتح Developer Tools (F12) → Console

**إذا كان الإعداد صحيح:**
```
📤 Sending to Google Sheets: https://script.google.com/...
✅ Data sent to Google Sheets successfully
```

**إذا كان الإعداد خاطئ:**
```
⚠️ Google Sheets not configured.
📝 To fix this:
   1. For local development: Add VITE_GOOGLE_SHEETS_WEB_APP_URL to .env file
   2. For Vercel: Go to Dashboard → Settings → Environment Variables
```

## ملاحظات مهمة:

1. **Environment Variables في Vercel منفصلة عن `.env` محلياً**
   - `.env` يعمل فقط محلياً
   - Vercel يحتاج Environment Variables من Dashboard

2. **أضف للبيئات الثلاثة:**
   - Production (للنشر النهائي)
   - Preview (للـ preview deployments)
   - Development (للـ development)

3. **بعد إضافة Environment Variable:**
   - يجب إعادة النشر
   - Vercel سيعيد النشر تلقائياً أو يمكنك إعادة النشر يدوياً

## استكشاف الأخطاء:

### المشكلة: Environment Variable موجود لكن لا يعمل
1. تحقق من أن الاسم صحيح: `VITE_GOOGLE_SHEETS_WEB_APP_URL`
2. تحقق من أن القيمة صحيحة (URL كامل)
3. تأكد من إعادة النشر بعد الإضافة
4. تحقق من Browser Console للأخطاء

### المشكلة: يعمل محلياً لكن لا يعمل في Vercel
- هذا يعني أن Environment Variable موجود في `.env` لكن غير موجود في Vercel
- أضفه في Vercel Dashboard كما هو موضح أعلاه

## مثال على Environment Variable:

```
Name: VITE_GOOGLE_SHEETS_WEB_APP_URL
Value: https://script.google.com/macros/s/AKfycbxgVpqFGBqxbCBNPD39lpGAUQEMVVyqsY5jgTMnMKCH1gprhLN_4uxOZv8gzOF78nP2/exec
Environments: Production, Preview, Development
```

## رابط سريع:

- Vercel Dashboard: https://vercel.com/dashboard
- Google Sheet: https://docs.google.com/spreadsheets/d/1yk9HEnwF_70kJKayFHPCh32l08Df7Rp3OSMavmqGNsA/edit
