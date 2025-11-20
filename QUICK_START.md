# 🚀 Quick Start Guide - Alumni Dashboard

## Installation

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Available Routes

### Public Routes

- `/` - Landing page (home)
- `/auth` - Login/Signup page
  - `/auth?type=alumni` - Alumni login
  - `/auth?type=admin` - Admin SMK login
  - `/auth?type=company` - Company login

### Protected Routes (Require Login)

- `/alumni/dashboard` - Main dashboard
- `/alumni/dashboard?tab=profile` - Edit profile
- `/alumni/dashboard?tab=documents` - Manage documents
- `/alumni/dashboard?tab=jobs` - Job listings (placeholder)
- `/alumni/dashboard?tab=activities` - Activity history (placeholder)

## 👥 Demo Credentials

Since authentication is mocked, you can use any email/password combination:

```
Email: test@alumni.com
Password: password123

Email: admin@smk.com
Password: password123
```

## 📱 Testing Features

### 1. Dashboard

- View profile completion percentage
- See recent activities
- Browse recommended jobs
- Quick action buttons

### 2. Profile Form

- Upload avatar (max 2MB, JPG/PNG)
- Add personal information
- Add bio (max 500 chars)
- Select technical & soft skills
- Choose work status (radio buttons)

### 3. Document Manager

- Upload documents (PDF/DOC/DOCX/JPG/PNG, max 5MB)
- Select document type (CV, Sertifikat, Portofolio, Surat Rekomendasi)
- Download documents
- Delete with confirmation

### 4. Authentication

- Sign up dengan email/password
- Login dengan email/password
- Session persistence (reload page to test)
- Auto-redirect to dashboard setelah login

## 🛠️ File Structure

```
src/
├── pages/
│   ├── Index.tsx                 # Landing page
│   ├── Auth.tsx                  # Login/Signup
│   ├── NotFound.tsx              # 404 page
│   └── alumni/
│       ├── Dashboard.tsx         # Main dashboard
│       ├── ProfileForm.tsx       # Profile editor
│       └── DocumentsManager.tsx  # Doc management
│
├── components/
│   ├── ProtectedRoute.tsx        # Auth wrapper
│   ├── layouts/
│   │   └── AlumniLayout.tsx      # Main layout
│   └── ui/                       # Shadcn UI components
│
├── context/
│   └── AuthContext.tsx           # Auth state & logic
│
├── types/
│   └── index.ts                  # Type definitions
│
└── App.tsx                       # Main app routes
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts` untuk mengubah warna primary/secondary/accent:

```typescript
colors: {
  primary: { DEFAULT: "hsl(var(--primary))", ... },
  secondary: { DEFAULT: "hsl(var(--secondary))", ... },
  accent: { DEFAULT: "hsl(var(--accent))", ... },
}
```

### Work Status Colors

Edit `src/pages/alumni/Dashboard.tsx` line ~47:

```typescript
const workStatusConfig: Record<string, { ... }> = {
  siap_bekerja: { color: 'bg-green-100 ...', ... },
  // ...
}
```

## 🔧 Integration with Backend

### Authentication

Replace mock implementation di `src/context/AuthContext.tsx`:

```typescript
const login = async (email: string, password: string, role: UserRole) => {
  // Replace with: const response = await fetch('/api/auth/login', ...)
  // Parse response & set user
};
```

### API Calls

Update components untuk fetch data dari backend:

```typescript
// Example: Dashboard.tsx
useEffect(() => {
  const fetchStats = async () => {
    const response = await fetch("/api/alumni/stats");
    const data = await response.json();
    // setStats(data)
  };
  fetchStats();
}, []);
```

### File Upload

DocumentsManager sudah menggunakan File API, siap untuk backend:

```typescript
const formData = new FormData();
formData.append("file", uploadForm.file);
formData.append("title", uploadForm.title);
formData.append("type", uploadForm.fileType);

await fetch("/api/documents/upload", {
  method: "POST",
  body: formData,
});
```

## 📊 Component Props

### AlumniLayout

```typescript
<AlumniLayout activeTab="dashboard">{children}</AlumniLayout>
```

### ProtectedRoute

```typescript
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

- Jalankan `npm install` untuk install dependencies
- Check import paths menggunakan `@/` alias

### Issue: Styling tidak muncul

- Restart dev server: `npm run dev`
- Clear browser cache (Ctrl+Shift+R)

### Issue: Authentication tidak bekerja

- Check localStorage di browser console: `localStorage.getItem('user')`
- Clear & login ulang: `localStorage.removeItem('user')`

## 📚 Documentation

- [Full Implementation Guide](./FASE3_IMPLEMENTATION.md)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [React Router Docs](https://reactrouter.com)

## ✨ Features Summary

✅ Responsive design (mobile/tablet/desktop)
✅ Dark mode support (via next-themes)
✅ Form validation
✅ File upload with preview
✅ Authentication context
✅ Protected routes
✅ Toast notifications
✅ Loading states
✅ Empty states
✅ Smooth transitions & animations
✅ TypeScript strict mode
✅ Accessible components

## 🚀 Performance Tips

1. Images: Optimize & compress sebelum upload
2. Bundle: `npm run build` untuk production build
3. Network: Gunakan React Query untuk API calls
4. Components: Lazy load dengan React.lazy()

## 📞 Support

Untuk issues atau questions, check:

1. Browser console (F12) untuk errors
2. Network tab untuk API failures
3. ESLint errors: `npm run lint`

---

**Status**: ✅ Ready for Development
**Last Updated**: November 2025
**Version**: 1.0.0
