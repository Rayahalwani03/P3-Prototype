# GitHub CSV Upload Setup

## ملاحظة مهمة

رفع الملفات إلى GitHub من المتصفح **غير ممكن مباشرة** لأسباب أمنية. لكن يمكن:

1. ✅ **تحميل CSV تلقائياً** (تم إضافته)
2. ✅ **إرسال البيانات إلى Google Sheets** (موجود بالفعل)
3. ⚙️ **رفع CSV إلى GitHub عبر API** (يحتاج إعدادات إضافية)

## الخيار 1: التحميل التلقائي (موصى به)

الآن CSV يتم تحميله تلقائياً عند انتهاء التجربة. المستخدمون يمكنهم:
- حفظ الملفات محلياً
- رفعها يدوياً إلى Google Sheets أو أي مكان آخر

## الخيار 2: رفع تلقائي إلى GitHub (اختياري)

إذا كنت تريد رفع CSV تلقائياً إلى GitHub، تحتاج:

### الخطوة 1: إنشاء GitHub Personal Access Token

1. اذهب إلى GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. انقر "Generate new token (classic)"
3. أعطِه اسم (مثل: "Vercel CSV Upload")
4. اختر الصلاحيات:
   - `repo` (Full control of private repositories)
5. انسخ Token

### الخطوة 2: إضافة Environment Variables في Vercel

1. اذهب إلى Vercel Dashboard → Settings → Environment Variables
2. أضف:
   - **Name**: `GITHUB_TOKEN`
   - **Value**: Token الذي نسخته
   - **Environment**: Production, Preview, Development

3. (اختياري) أضف:
   - **Name**: `GITHUB_REPO`
   - **Value**: `Rayahalwani03/P3-Prototype` (أو اسم repo الخاص بك)
   - **Name**: `GITHUB_BRANCH`
   - **Value**: `main`
   - **Name**: `GITHUB_CSV_PATH`
   - **Value**: `data` (المجلد الذي سيحفظ فيه CSV files)

### الخطوة 3: تفعيل GitHub Upload

1. في Vercel Environment Variables، أضف:
   - **Name**: `VITE_GITHUB_UPLOAD_ENABLED`
   - **Value**: `true`
   - **Environment**: Production, Preview, Development

2. أعد نشر المشروع

### الخطوة 4: إنشاء مجلد data في GitHub

```bash
cd /Users/raya/Desktop/P3-Protoype
mkdir -p data
echo "# Data files" > data/README.md
git add data/
git commit -m "Add data folder for CSV uploads"
git push origin main
```

## ملاحظات أمنية

⚠️ **GitHub Token حساس**:
- لا تشاركه أبداً
- لا تضعه في الكود
- استخدمه فقط في Vercel Environment Variables
- إذا تم تسريبه، احذفه فوراً وأنشئ واحد جديد

## التوصية

**استخدم Google Sheets** بدلاً من GitHub:
- ✅ أسهل في الإعداد
- ✅ لا يحتاج tokens
- ✅ يمكن تصديره إلى CSV بسهولة
- ✅ Real-time collaboration
- ✅ مجاني

CSV التحميل التلقائي كافٍ لمعظم الحالات.
