import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  GraduationCap, 
  Building2, 
  Shield, 
  FileText, 
  Bell, 
  Users,
  CheckCircle,
  TrendingUp,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Akun Alumni",
      description: "Profil lengkap dengan CV, portofolio, dan status kesiapan kerja yang dapat diperbarui kapan saja."
    },
    {
      icon: Shield,
      title: "Dashboard Admin",
      description: "Verifikasi data alumni, kelola perusahaan mitra, dan pantau seluruh aktivitas sistem."
    },
    {
      icon: Building2,
      title: "Portal Perusahaan",
      description: "Akses database alumni berdasarkan kompetensi dan posting lowongan kerja eksklusif."
    },
    {
      icon: CheckCircle,
      title: "Status Kesiapan Kerja",
      description: "Sistem manual untuk memastikan data alumni sesuai realita, bukan hanya angka."
    },
    {
      icon: Bell,
      title: "Notifikasi Lowongan",
      description: "Alumni mendapat pemberitahuan otomatis untuk lowongan yang sesuai kompetensi."
    },
    {
      icon: FileText,
      title: "Keamanan Data",
      description: "Sistem login aman dengan kontrol privasi penuh untuk setiap pengguna."
    }
  ];

  const userTypes = [
    {
      icon: GraduationCap,
      title: "Alumni",
      description: "Buat profil profesional, unggah dokumen, dan dapatkan peluang kerja sesuai keahlian Anda.",
      color: "from-primary to-accent",
      link: "/alumni/login"
    },
    {
      icon: Shield,
      title: "Admin SMK",
      description: "Kelola data alumni, verifikasi informasi, dan bangun jaringan dengan perusahaan mitra.",
      color: "from-secondary to-primary",
      link: "/admin/login"
    },
    {
      icon: Building2,
      title: "Perusahaan",
      description: "Temukan talenta terbaik dari lulusan SMK dan posting lowongan kerja eksklusif.",
      color: "from-accent to-secondary",
      link: "/company/login"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Alumni SMK
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Tentang</Button>
              <Button variant="ghost">Fitur</Button>
              <Button variant="default">Masuk</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Sistem Manajemen Alumni Terpadu
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Jembatan Profesional untuk
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Alumni SMK
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Platform terpadu yang menghubungkan alumni, sekolah, dan perusahaan. 
              Kelola profil, temukan peluang kerja, dan bangun karir profesional Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="gap-2 shadow-elegant">
                Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Pilih Portal Anda</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Akses sistem sesuai dengan peran Anda
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {userTypes.map((type, index) => (
              <Card 
                key={index}
                className="relative overflow-hidden group hover:shadow-elegant transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/50"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="p-8 space-y-4 relative">
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-card`}>
                    <type.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">{type.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                  <Button variant="ghost" className="gap-2 group/btn">
                    Masuk
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Fitur Unggulan</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Sistem lengkap untuk mengelola data alumni dan menjembatani peluang karir
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 space-y-4 hover:shadow-card transition-all duration-300 border-border/50 hover:border-primary/30 group"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
            <h2 className="text-3xl md:text-5xl font-bold">
              Siap Membangun Karir Profesional?
            </h2>
            <p className="text-lg md:text-xl text-white/90">
              Bergabunglah dengan ribuan alumni SMK yang telah menemukan peluang karir melalui platform kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" variant="secondary" className="gap-2 shadow-elegant">
                Daftar Sekarang
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Alumni SMK</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Platform terpadu untuk menghubungkan alumni, sekolah, dan perusahaan.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Portal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Alumni</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Admin SMK</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Perusahaan</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Fitur</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Profil Alumni</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Lowongan Kerja</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Verifikasi Data</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Bantuan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Kontak</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Alumni SMK. Hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
