import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Building2, Shield, Users, CheckCircle, TrendingUp, ArrowRight, Briefcase, Bell, LogOut, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ContactForm from "@/components/ContactForm";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/config/api";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Record<string, unknown> | null>(null);

  // Fetch avatar and profile data from profile endpoint when user logs in
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token");
          let endpoint = "";

          // Determine endpoint based on user role
          if (user.role === "alumni") {
            endpoint = `${API_URL}/alumni/me`;
          } else if (user.role === "company") {
            endpoint = `${API_URL}/company/me`;
          } else if (user.role === "admin") {
            endpoint = `${API_URL}/admin/me`;
          }

          if (endpoint) {
            const response = await fetch(endpoint, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            });

            if (response.ok) {
              const data = await response.json();
              setAvatar(data.avatar || null);
              setProfileData(data);
            }
          }
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        }
      } else {
        setAvatar(null);
        setProfileData(null);
      }
    };

    fetchProfileData();
  }, [user]);

  const features = [
    {
      icon: Users,
      title: "Jejaring Alumni",
      description: "Terhubung kembali dengan rekan seangkatan dan bangun relasi profesional yang kuat.",
    },
    {
      icon: Briefcase,
      title: "Karir & Lowongan",
      description: "Akses eksklusif ke ribuan lowongan kerja dari perusahaan mitra terpercaya.",
    },
    {
      icon: Shield,
      title: "Data Terverifikasi",
      description: "Validasi data alumni dan perusahaan untuk keamanan dan kepercayaan bersama.",
    },
    {
      icon: TrendingUp,
      title: "Pengembangan Karir",
      description: "Pantau perkembangan karir alumni dengan fitur tracking dan reporting canggih.",
    },
  ];

  const portals = [
    {
      role: "Alumni",
      icon: GraduationCap,
      description: "Bangun profil profesional, lamar kerja, dan kembangkan karirmu.",
      action: "Masuk sebagai Alumni",
      path: "/auth",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      role: "Perusahaan",
      icon: Building2,
      description: "Temukan talenta terbaik dan posting lowongan kerja dengan mudah.",
      action: "Masuk sebagai Mitra",
      path: "/company/auth",
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      role: "Sekolah",
      icon: Shield,
      description: "Kelola data alumni dan pantau keterserapan lulusan di dunia kerja.",
      action: "Masuk Dashboard",
      path: "/admin/auth",
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  const [publicStats, setPublicStats] = useState<{
    total_alumni?: number | null;
    total_companies?: number | null;
    total_job_postings?: number | null;
    employment_rate?: number | null;
    loading?: boolean;
  }>({ loading: true });

  // Navbar active link for shared underline (features, portals, contact)
  const [activeLink, setActiveLink] = useState<string>(() => {
    try {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      return hash ? hash.replace(/^#/, "") : "features";
    } catch (e) {
      return "features";
    }
  });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash) setActiveLink(hash);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/public/stats`);
        if (!res.ok) throw new Error("Failed to fetch public stats");
        const data = await res.json();
        if (mounted) {
          setPublicStats({
            total_alumni: data.total_alumni ?? null,
            total_companies: data.total_companies ?? null,
            total_job_postings: data.total_job_postings ?? null,
            employment_rate: data.employment_rate ?? null,
            loading: false,
          });
        }
      } catch (err) {
        console.error("Error fetching public stats:", err);
        if (mounted) setPublicStats((s) => ({ ...(s || {}), loading: false }));
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    {
      label: "Alumni Terdaftar",
      value: publicStats.loading ? "—" : publicStats.total_alumni !== null && publicStats.total_alumni !== undefined ? publicStats.total_alumni.toLocaleString() : "—",
    },
    {
      label: "Perusahaan Mitra",
      value: publicStats.loading ? "—" : publicStats.total_companies !== null && publicStats.total_companies !== undefined ? publicStats.total_companies.toLocaleString() : "—",
    },
    {
      label: "Lowongan Aktif",
      value: publicStats.loading ? "—" : publicStats.total_job_postings !== null && publicStats.total_job_postings !== undefined ? publicStats.total_job_postings.toLocaleString() : "—",
    },
    {
      label: "Tingkat Keterserapan",
      value: publicStats.loading ? "—" : publicStats.employment_rate !== null && publicStats.employment_rate !== undefined ? `${publicStats.employment_rate}%` : "—",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes neonGlow {
            0%, 100% {
              text-shadow: 0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary));
            }
            50% {
              text-shadow: 0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary)), 0 0 60px hsl(var(--primary));
            }
          }
        `,
        }}
      />
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">AlumniHub</span>
          </div>
          {/* left intentionally left only for brand; nav links moved to right for alignment */}
          <div className="flex items-center gap-4">
            <motion.div layout className="hidden md:flex items-center gap-8 mr-4 transition-all duration-300 ease-out">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                  setActiveLink("features");
                  if (typeof window !== "undefined") window.location.hash = "#features";
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative inline-block py-1"
              >
                <span className="relative z-10">Fitur</span>
                {activeLink === "features" && <motion.span layoutId="nav-underline" className="absolute left-0 -bottom-0.5 h-[2px] bg-primary w-full" />}
              </a>

              <a
                href="#portals"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("portals")?.scrollIntoView({ behavior: "smooth" });
                  setActiveLink("portals");
                  if (typeof window !== "undefined") window.location.hash = "#portals";
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative inline-block py-1"
              >
                <span className="relative z-10">Akses</span>
                {activeLink === "portals" && <motion.span layoutId="nav-underline" className="absolute left-0 -bottom-0.5 h-[2px] bg-primary w-full" />}
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  setActiveLink("contact");
                  if (typeof window !== "undefined") window.location.hash = "#contact";
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative inline-block py-1"
              >
                <span className="relative z-10">Kontak</span>
                {activeLink === "contact" && <motion.span layoutId="nav-underline" className="absolute left-0 -bottom-0.5 h-[2px] bg-primary w-full" />}
              </a>
            </motion.div>

            {user ? (
              <>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const dashboardPath = user.role === "alumni" ? "/alumni/dashboard" : user.role === "company" ? "/company/dashboard" : user.role === "admin" ? "/admin/dashboard" : "/auth";
                    navigate(dashboardPath);
                  }}
                  className="flex items-center gap-1"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Content */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary text-xs font-bold mb-6 border border-primary/30 uppercase tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Platform Terpercaya
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight text-foreground">
                Jembatan <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-extrabold">Karir & Relasi</span> Alumni Profesional
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto lg:mx-0 mb-10 leading-relaxed font-normal">
                Sambungkan kembali dengan alumni lainnya, jelajahi peluang karir eksklusif dari perusahaan terkemuka, dan bangun jaringan profesional yang kuat untuk kesuksesan karir jangka panjang.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14">
                <Button size="lg" className="h-12 px-8 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all" onClick={() => navigate("/auth")}>
                  Mulai Gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-sm font-semibold rounded-lg hover:bg-muted/50" onClick={() => document.getElementById("portals")?.scrollIntoView({ behavior: "smooth" })}>
                  Jelajahi Portal
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border/40">
                {stats.slice(0, 3).map((stat, index) => (
                  <motion.div key={index} className="space-y-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                    <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Animated Profile Card */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:flex items-center justify-center h-[600px] w-full relative">
              {/* Abstract Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

              {/* Main Card Wrapper */}
              <div className="relative w-full max-w-md mx-auto">
                {/* Main Card */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="bg-card/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 z-10 relative">
                  {user ? (
                    // Show actual user data when logged in
                    <>
                      {user.role === "alumni" ? (
                        // Alumni Profile Card
                        <>
                          {/* User Profile Header */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-[2px]">
                                <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                                  {avatar ? <img src={avatar} alt={user.name} className="w-full h-full object-cover" /> : <span className="text-lg font-bold text-blue-600">{user.name.charAt(0).toUpperCase()}</span>}
                                </div>
                              </div>
                              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base">{user.name}</h3>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                  <CheckCircle className="h-3 w-3" /> Verified
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">Alumni</p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="mb-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              <CheckCircle className="h-3 w-3" /> Siap Bekerja
                            </span>
                          </div>

                          {/* Alumni Info */}
                          <div className="space-y-3 mb-6 pt-4 border-t border-border/30">
                            <div>
                              <p className="text-xs font-semibold text-foreground/60">Tentang Anda</p>
                              <p className="text-sm text-foreground line-clamp-2">{(profileData?.bio as string) || "Belum ada deskripsi"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground/60">Keahlian</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profileData?.skills && Array.isArray(profileData.skills) && profileData.skills.length > 0 ? (
                                  profileData.skills.slice(0, 3).map((skill: string, idx: number) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-muted-foreground">Belum ada keahlian</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm font-semibold h-10 rounded-lg" onClick={() => navigate("/alumni/dashboard")}>
                              Lihat Dashboard
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full text-sm font-semibold h-10 rounded-lg"
                              onClick={() => {
                                logout();
                                navigate("/");
                              }}
                            >
                              Logout
                            </Button>
                          </div>
                        </>
                      ) : user.role === "company" ? (
                        // Company Profile Card
                        <>
                          {/* Company Profile Header */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 p-[2px]">
                                <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                                  {avatar ? <img src={avatar} alt={user.name} className="w-full h-full object-cover" /> : <span className="text-lg font-bold text-purple-600">{user.name.charAt(0).toUpperCase()}</span>}
                                </div>
                              </div>
                              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base">{user.name}</h3>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                                  <Briefcase className="h-3 w-3" /> Verified
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">Perusahaan</p>
                            </div>
                          </div>

                          {/* Company Status Badge */}
                          <div className="mb-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                              <Briefcase className="h-3 w-3" /> Aktif Merekrut
                            </span>
                          </div>

                          {/* Company Info */}
                          <div className="space-y-3 mb-6 pt-4 border-t border-border/30">
                            <div>
                              <p className="text-xs font-semibold text-foreground/60">Email Perusahaan</p>
                              <p className="text-sm text-foreground">{user.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground/60">Status Akun</p>
                              <p className="text-sm text-foreground font-semibold text-green-600">Terverifikasi</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-sm font-semibold h-10 rounded-lg" onClick={() => navigate("/company/dashboard")}>
                              Dashboard Rekrutmen
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full text-sm font-semibold h-10 rounded-lg"
                              onClick={() => {
                                logout();
                                navigate("/");
                              }}
                            >
                              Logout
                            </Button>
                          </div>
                        </>
                      ) : (
                        // Admin Profile Card
                        <>
                          {/* Admin Profile Header */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 p-[2px]">
                                <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                                  {avatar ? <img src={avatar} alt={user.name} className="w-full h-full object-cover" /> : <span className="text-lg font-bold text-emerald-600">{user.name.charAt(0).toUpperCase()}</span>}
                                </div>
                              </div>
                              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base">{user.name}</h3>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                  <Shield className="h-3 w-3" /> Admin
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">Administrator</p>
                            </div>
                          </div>

                          {/* Admin Status Badge */}
                          <div className="mb-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                              <Shield className="h-3 w-3" /> Sistem Aktif
                            </span>
                          </div>

                          {/* Admin Info */}
                          <div className="space-y-3 mb-6 pt-4 border-t border-border/30">
                            <div>
                              <p className="text-xs font-semibold text-foreground/60">Email Admin</p>
                              <p className="text-sm text-foreground">{user.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground/60">Privilege Level</p>
                              <p className="text-sm text-foreground font-semibold">Super Administrator</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold h-10 rounded-lg" onClick={() => navigate("/admin/dashboard")}>
                              Panel Administrasi
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full text-sm font-semibold h-10 rounded-lg"
                              onClick={() => {
                                logout();
                                navigate("/");
                              }}
                            >
                              Logout
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    // Show profile builder placeholder when not logged in
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 p-[2px] flex items-center justify-center">
                          <div className="h-full w-full rounded-full bg-muted/50 flex items-center justify-center border-2 border-dashed border-primary/30">
                            <Users className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="h-3 w-32 bg-muted rounded mb-2 animate-pulse"></div>
                          <div className="h-2 w-24 bg-muted rounded animate-pulse"></div>
                        </div>
                      </div>

                      {/* Bio Input Field */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground/60">Tentang Anda</label>
                        <div className="h-16 bg-muted/50 rounded-lg border border-primary/20 p-3 space-y-1">
                          <div className="h-2 w-full bg-muted rounded animate-pulse"></div>
                          <div className="h-2 w-4/5 bg-muted rounded animate-pulse"></div>
                          <div className="h-2 w-3/4 bg-muted rounded animate-pulse"></div>
                        </div>
                      </div>

                      {/* Skills Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground/60">Keahlian</label>
                        <div className="flex flex-wrap gap-2">
                          <div className="h-8 w-16 bg-primary/15 rounded-full border border-primary/30 animate-pulse"></div>
                          <div className="h-8 w-20 bg-primary/15 rounded-full border border-primary/30 animate-pulse"></div>
                          <div className="h-8 w-14 bg-primary/15 rounded-full border border-primary/30 animate-pulse"></div>
                        </div>
                      </div>

                      {/* Stats Placeholder */}
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/30">
                        <div className="space-y-2">
                          <div className="h-2 w-12 bg-muted rounded animate-pulse"></div>
                          <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-12 bg-muted rounded animate-pulse"></div>
                          <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                        </div>
                      </div>

                      {/* Submit Button Placeholder */}
                      <button className="w-full h-10 bg-primary/20 rounded-lg border border-primary/30 text-xs font-semibold text-primary/60 hover:bg-primary/30 transition-colors mt-2">Lengkapi Profil Anda</button>
                    </div>
                  )}
                </motion.div>

                {/* Floating Elements - Dynamic by Role */}
                {user?.role === "alumni" ? (
                  <>
                    {/* Alumni: Work Status */}
                    <motion.div
                      animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute left-1/2 -translate-x-1/2 -top-16 bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 z-20 w-48"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="font-bold text-sm">Siap Bekerja</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Alumni: Profile Completion */}
                    <motion.div
                      animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -left-8 bottom-12 bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 z-20 w-48"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Kelengkapan</p>
                          <p className="font-bold text-sm">Profil Lengkap</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                ) : user?.role === "company" ? (
                  <>
                    {/* Company: Active Postings */}
                    <motion.div
                      animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute left-1/2 -translate-x-1/2 -top-16 bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 z-20 w-48"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Lowongan</p>
                          <p className="font-bold text-sm">Aktif Posting</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Company: Candidates */}
                    <motion.div
                      animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -left-8 bottom-12 bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 z-20 w-48"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Talenta</p>
                          <p className="font-bold text-sm">Cari Kandidat</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                ) : user?.role === "admin" ? (
                  <>
                    {/* Admin: Total Alumni */}
                    <motion.div
                      animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute left-1/2 -translate-x-1/2 -top-16 bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 z-20 w-48"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Data</p>
                          <p className="font-bold text-sm">Alumni Terdaftar</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Admin: System Stats */}
                    <motion.div
                      animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -left-8 bottom-12 bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 z-20 w-48"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Sistem</p>
                          <p className="font-bold text-sm">Monitoring</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                ) : null}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="portals" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pilih Portal Anda</h2>
            <p className="text-muted-foreground text-base">Masuk ke portal yang sesuai dengan peran Anda untuk memulai perjalanan karir.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {portals.map((portal, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 group cursor-pointer" onClick={() => navigate(portal.path)}>
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className={`h-14 w-14 rounded-2xl ${portal.bg} ${portal.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <portal.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{portal.role}</h3>
                    <p className="text-muted-foreground text-sm mb-8 flex-grow leading-relaxed font-normal">{portal.description}</p>
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                      {portal.action} <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Solusi Lengkap untuk <br />
                  <span className="text-primary font-extrabold">Ekosistem Pendidikan</span>
                </h2>
                <p className="text-muted-foreground text-base">Kami menyediakan platform komprehensif yang menghubungkan institusi pendidikan, alumni profesional, dan perusahaan untuk menciptakan ekosistem karir yang berkelanjutan.</p>
              </div>

              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <feature.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed font-normal">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl -z-10"></div>

              {/* Solution Benefits Cards */}
              <div className="grid gap-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-card/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-400/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-base mb-2">Peningkatan Karir</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">Monitoring perkembangan karir alumni dengan data real-time dan insights yang actionable.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-purple-400/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-base mb-2">Kolaborasi Industri</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">Kerjasama langsung dengan perusahaan terkemuka untuk membuka peluang karir eksklusif.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-card/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-emerald-400/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-base mb-2">Data & Keamanan</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">Sistem keamanan tingkat enterprise untuk melindungi data alumni dan perusahaan.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-card/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-orange-400/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-base mb-2">Komunitas Global</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">Jaringan alumni internasional untuk memperluas peluang kolaborasi dan pertumbuhan.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Contact Section */}
      <section id="contact" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hubungi Kami</h2>
            <p className="text-muted-foreground text-base">Punya pertanyaan tentang platform? Tim dukungan kami siap membantu Anda dalam proses bergabung.</p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg">AlumniHub</span>
            </div>
            <div className="text-sm text-muted-foreground relative">
              &copy; {new Date().getFullYear()} Alumni Connect Hub. All rights reserved.
              {/* Info pembuat, tidak terlalu kelihatan */}
              <span style={{ fontSize: "0.01px", opacity: 0.2, userSelect: "none", position: "absolute", left: "-9999px" }}>Created by Hamid (Medz)</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
