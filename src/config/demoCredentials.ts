/**
 * Demo Credentials for Testing
 * Use these credentials to test the application
 */

export const DEMO_CREDENTIALS = {
  alumni: {
    email: "demo.alumni@gmail.com",
    password: "demo1234",
    name: "Ahmad Hidayatullah",
    role: "alumni",
  },
  company: {
    email: "demo.company@gmail.com",
    password: "demo1234",
    name: "PT. Demo Indonesia",
    role: "company",
  },
  admin: {
    email: "demo.admin@gmail.com",
    password: "demo1234",
    name: "Admin SMK",
    role: "admin",
  },
};

export const DEMO_ACCOUNTS = [
  {
    title: "🎓 Alumni",
    email: DEMO_CREDENTIALS.alumni.email,
    password: DEMO_CREDENTIALS.alumni.password,
    description: "Akses profil alumni, lihat lowongan, dan kelola dokumen",
    color: "from-blue-500/20 to-cyan-500/20",
    textColor: "text-blue-600",
  },
  {
    title: "🏢 Perusahaan",
    email: DEMO_CREDENTIALS.company.email,
    password: DEMO_CREDENTIALS.company.password,
    description: "Monitor alumni, posting lowongan, dan hubungi calon karyawan",
    color: "from-purple-500/20 to-pink-500/20",
    textColor: "text-purple-600",
  },
  {
    title: "👨‍💼 Admin",
    email: DEMO_CREDENTIALS.admin.email,
    password: DEMO_CREDENTIALS.admin.password,
    description: "Kelola sistem, verifikasi data, dan monitor semua aktivitas",
    color: "from-orange-500/20 to-red-500/20",
    textColor: "text-orange-600",
  },
];
