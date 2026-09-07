# راهنمای مشارکت

از مشارکت شما در توسعه این پروژه استقبال می‌کنیم! لطفاً قبل از ارسال Pull Request، این راهنما را مطالعه کنید.

## نحوه مشارکت

### گزارش باگ

اگر باگی پیدا کردید، لطفاً یک Issue جدید ایجاد کنید و موارد زیر را شامل کنید:

- توضیح واضح از مشکل
- مراحل بازتولید مشکل
- رفتار مورد انتظار
- اسکرین‌شات (در صورت امکان)
- اطلاعات محیط (مرورگر، سیستم عامل)

### پیشنهاد ویژگی

برای پیشنهاد ویژگی جدید:

1. ابتدا Issue را بررسی کنید که مشابه آن وجود نداشته باشد
2. یک Issue جدید با برچسب `enhancement` ایجاد کنید
3. ویژگی را به وضوح توضیح دهید
4. در صورت امکان، نمونه‌ای از استفاده ارائه دهید

### ارسال Pull Request

1. Repository را Fork کنید
2. یک Branch جدید ایجاد کنید:
   ```bash
   git checkout -b feature/your-feature-name
   # یا
   git checkout -b fix/your-bug-fix
   ```
3. تغییرات را commit کنید:
   ```bash
   git commit -m "Add: your feature description"
   ```
4. به Branch اصلی Push کنید:
   ```bash
   git push origin feature/your-feature-name
   ```
5. یک Pull Request ایجاد کنید

## استانداردهای کد

### TypeScript

- از TypeScript strict mode استفاده کنید
- از `any` تا حد امکان اجتناب کنید
- Type های مناسب تعریف کنید

### React

- از Functional Components استفاده کنید
- از React Hooks به درستی استفاده کنید
- کامپوننت‌ها را کوچک و قابل استفاده مجدد نگه دارید

### CSS

- از Tailwind CSS utility classes استفاده کنید
- از استایل‌های سفارشی تا حد امکان اجتناب کنید
- برای دارک مود از کلاس‌های `dark:` استفاده کنید

### Commit Messages

از فرمت Conventional Commits استفاده کنید:

- `feat:` برای ویژگی‌های جدید
- `fix:` برای رفع باگ‌ها
- `docs:` برای تغییرات مستندات
- `style:` برای تغییرات قالب‌بندی
- `refactor:` برای بازسازی کد
- `test:` برای افزودن تست‌ها
- `chore:` برای تغییرات عمومی

مثال:
```
feat: add dark mode support
fix: resolve inbox filter issue
docs: update README with installation steps
```

## توسعه محلی

```bash
# Clone repository
git clone https://github.com/yourusername/office-automation.git
cd office-automation

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## ساختار پروژه

لطفاً ساختار پروژه را رعایت کنید:

- `src/components/` - کامپوننت‌های مشترک
- `src/pages/` - صفحات اصلی
- `src/store/` - State management
- `src/types/` - TypeScript types
- `src/utils/` - توابع کمکی
- `src/contexts/` - React contexts

## تست

قبل از ارسال Pull Request، مطمئن شوید که:

- کد بدون خطا build می‌شود: `npm run build`
- هیچ خطای TypeScript وجود ندارد
- تغییرات در حالت Light و Dark درست کار می‌کنند
- رابط کاربری RTL است

## سوالات

اگر سوالی دارید، می‌توانید:

- یک Issue ایجاد کنید
- با maintainer تماس بگیرید

---

از مشارکت شما متشکریم! 🙏
