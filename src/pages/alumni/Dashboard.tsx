import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, FileText, Briefcase, Eye, Clock, Target, CheckCircle2, ArrowRight, Download, Share2, Edit, MapPin, Heart, Send, LogOut, Home, Sparkles, Zap, BarChart3, MessageCircle, Phone, X } from "lucide-react";
import ProfileForm from "./ProfileForm";
import DocumentsManager from "./DocumentsManager";

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
  trend?: string;
  color: string;
}

interface Activity {
  id: string;
  type: "profile" | "document" | "job" | "achievement";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  type: "Full Time" | "Part Time" | "Contract";
  match: number;
}

interface Message {
  id: string;
  companyId: string;
  companyName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [liked, setLiked] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Message | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      companyId: "comp1",
      companyName: "PT Teknologi Indonesia",
      lastMessage: "Terima kasih atas lamaran Anda. Kami akan segera menghubungi.",
      timestamp: "2 jam lalu",
      unread: 1,
      avatar: "https://avatar.vercel.sh/company1",
    },
    {
      id: "2",
      companyId: "comp2",
      companyName: "Startup Digital Hub",
      lastMessage: "Apakah Anda tersedia untuk wawancara minggu depan?",
      timestamp: "1 hari lalu",
      unread: 0,
      avatar: "https://avatar.vercel.sh/company2",
    },
    {
      id: "3",
      companyId: "comp3",
      companyName: "PT Solusi Teknologi",
      lastMessage: "Dokumen CV Anda telah diterima dengan baik.",
      timestamp: "3 hari lalu",
      unread: 2,
      avatar: "https://avatar.vercel.sh/company3",
    },
  ]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    document.title = "Dashboard Alumni - Alumni Connect Hub";
  }, []);

  const profileCompletion = 75;

  const stats: StatCard[] = [
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Dokumen",
      value: "3",
      description: "File tersimpan",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-200 dark:border-blue-900",
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      label: "Aplikasi",
      value: "5",
      description: "Sedang berlangsung",
      trend: "+2",
      color: "from-purple-500/20 to-pink-500/20 border-purple-200 dark:border-purple-900",
    },
    {
      icon: <Eye className="h-5 w-5" />,
      label: "Tayangan",
      value: "127",
      description: "Minggu ini",
      trend: "+12%",
      color: "from-orange-500/20 to-red-500/20 border-orange-200 dark:border-orange-900",
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: "Kesempatan",
      value: "8",
      description: "Sesuai kompetensi",
      color: "from-green-500/20 to-emerald-500/20 border-green-200 dark:border-green-900",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Pesan",
      value: "3",
      description: "Dari perusahaan",
      color: "from-indigo-500/20 to-cyan-500/20 border-indigo-200 dark:border-indigo-900",
    },
  ];

  const activities: Activity[] = [
    {
      id: "1",
      type: "profile",
      title: "Profil Diperbarui",
      description: "Anda telah memperbarui informasi profil",
      timestamp: "2 jam lalu",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    },
    {
      id: "2",
      type: "document",
      title: "Dokumen Diunduh",
      description: "CV_Ahmad_2024.pdf diunduh oleh PT Teknologi",
      timestamp: "1 hari lalu",
      icon: <Download className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "3",
      type: "job",
      title: "Lowongan Baru",
      description: "Frontend Developer di PT Digital Indonesia",
      timestamp: "3 hari lalu",
      icon: <Briefcase className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "4",
      type: "achievement",
      title: "Pencapaian Dibuka",
      description: "Profile Lengkap - Profil Anda 100% lengkap",
      timestamp: "1 minggu lalu",
      icon: <Target className="h-5 w-5 text-orange-500" />,
    },
  ];

  const recommendedJobs: Job[] = [
    {
      id: "1",
      title: "Frontend Developer",
      company: "PT Digital Indonesia",
      salary: "8 - 12 juta",
      location: "Jakarta",
      type: "Full Time",
      match: 95,
    },
    {
      id: "2",
      title: "UI/UX Designer",
      company: "Startup Tech Hub",
      salary: "6 - 10 juta",
      location: "Bandung",
      type: "Full Time",
      match: 88,
    },
    {
      id: "3",
      title: "Backend Developer",
      company: "PT Solusi Teknologi",
      salary: "10 - 15 juta",
      location: "Surabaya",
      type: "Full Time",
      match: 92,
    },
  ];

  const chartData = [
    { month: "Jan", views: 400, applications: 24 },
    { month: "Feb", views: 300, applications: 13 },
    { month: "Mar", views: 200, applications: 9 },
    { month: "Apr", views: 278, applications: 39 },
    { month: "May", views: 189, applications: 24 },
    { month: "Jun", views: 239, applications: 29 },
  ];

  const skillsData = [
    { name: "React", value: 35 },
    { name: "UI/UX", value: 25 },
    { name: "Backend", value: 25 },
    { name: "DevOps", value: 15 },
  ];

  const COLORS = ["#3b82f6", "#a855f7", "#ec4899", "#f59e0b"];

  const toggleLike = (jobId: string) => {
    setLiked((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]));
  };

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 pb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Navigation Header */}
      <motion.nav
        className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 hover:bg-muted">
                <Home className="h-5 w-5" />
                Kembali ke Beranda
              </Button>
            </motion.div>
            <motion.div className="flex items-center gap-4" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Header dengan Welcome Section */}
      <div className="relative overflow-hidden border-b border-border/50 bg-white/30 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="relative">
            {/* Avatar di pojok kanan atas (desktop only) */}
            <div className="hidden md:block absolute -top-8 right-0">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl" />
                <Avatar className="h-full w-full border-4 border-white shadow-2xl relative">
                  <AvatarImage src="https://avatar.vercel.sh/alumni" />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-secondary text-white">A</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Welcome Content - Centered */}
            <div className="flex flex-col items-center justify-center gap-8 text-center max-w-2xl">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  <TrendingUp className="h-4 w-4" />
                  Selamat datang kembali!
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Halo, <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Alumni</span>
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground">Pantau perkembangan profil Anda, jelajahi peluang kerja, dan kelola aplikasi dalam satu tempat yang mudah dan terpadu.</p>
                <div className="flex flex-wrap gap-3 pt-4 justify-center">
                  <Button onClick={() => setActiveTab("profile")} className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    <Edit className="h-4 w-4" />
                    Edit Profil
                  </Button>
                  <Button variant="outline" className="gap-2 hover:bg-muted">
                    <Share2 className="h-4 w-4" />
                    Bagikan Profil
                  </Button>
                </div>
              </div>
            </div>

            {/* Avatar di mobile (centered) */}
            <div className="md:hidden flex justify-center mt-8">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl" />
                <Avatar className="h-full w-full border-4 border-white shadow-2xl relative">
                  <AvatarImage src="https://avatar.vercel.sh/alumni" />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-secondary text-white">A</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Profile Completion Progress */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Kelengkapan Profil</h3>
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white font-semibold">{profileCompletion}%</Badge>
                </div>
                <Progress value={profileCompletion} className="h-2.5" />
                <p className="text-sm text-muted-foreground">Lengkapi profil Anda untuk meningkatkan visibilitas kepada perekrut</p>
              </div>
            </Card>

            <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50 hover:border-green-300/50 transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Status Kesiapan
                </h3>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 font-semibold border border-green-200 dark:border-green-900">✓ Siap Bekerja</Badge>
                  <span className="text-sm text-muted-foreground">Profil aktif dan terlihat oleh perekrut</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full md:w-auto gap-3 md:gap-6 mb-12 bg-gradient-to-r from-white/80 via-white/60 to-white/80 backdrop-blur-xl border border-white/20 shadow-2xl p-6 rounded-2xl relative">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse delay-1000" />

              <TabsTrigger
                value="overview"
                className="relative gap-2 py-2 px-4 rounded-2xl transition-all duration-500 hover:scale-110 hover:rotate-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-secondary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/50 data-[state=active]:scale-105 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <TrendingUp className="h-5 w-5 relative z-10 group-hover:animate-bounce" />
                <span className="hidden sm:inline font-semibold relative z-10 group-hover:text-white transition-colors">Ringkasan</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="relative gap-2 py-2 px-4 rounded-2xl transition-all duration-500 hover:scale-110 hover:rotate-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-secondary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/50 data-[state=active]:scale-105 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Edit className="h-5 w-5 relative z-10 group-hover:animate-bounce" />
                <span className="hidden sm:inline font-semibold relative z-10 group-hover:text-white transition-colors">Profil</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="relative gap-2 py-2 px-4 rounded-2xl transition-all duration-500 hover:scale-110 hover:rotate-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-secondary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/50 data-[state=active]:scale-105 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FileText className="h-5 w-5 relative z-10 group-hover:animate-bounce" />
                <span className="hidden sm:inline font-semibold relative z-10 group-hover:text-white transition-colors">Dokumen</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
              </TabsTrigger>
              <TabsTrigger
                value="jobs"
                className="relative gap-2 py-2 px-4 rounded-2xl transition-all duration-500 hover:scale-110 hover:rotate-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-secondary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/50 data-[state=active]:scale-105 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Briefcase className="h-5 w-5 relative z-10 group-hover:animate-bounce" />
                <span className="hidden sm:inline font-semibold relative z-10 group-hover:text-white transition-colors">Lowongan</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="relative gap-2 py-2 px-4 rounded-2xl transition-all duration-500 hover:scale-110 hover:rotate-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-secondary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/50 data-[state=active]:scale-105 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <MessageCircle className="h-5 w-5 relative z-10 group-hover:animate-bounce" />
                <span className="hidden sm:inline font-semibold relative z-10 group-hover:text-white transition-colors">Pesan</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="relative gap-2 py-2 px-4 rounded-2xl transition-all duration-500 hover:scale-110 hover:rotate-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-secondary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/50 data-[state=active]:scale-105 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Clock className="h-5 w-5 relative z-10 group-hover:animate-bounce" />
                <span className="hidden sm:inline font-semibold relative z-10 group-hover:text-white transition-colors">Aktivitas</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-indigo-400 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8 mt-8">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 border bg-gradient-to-br ${stat.color} hover:border-primary/50 p-6`}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-white" />
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                          {stat.icon}
                        </div>
                        {stat.trend && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400">
                            {stat.trend}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{stat.value}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-8 bg-white/70 backdrop-blur-lg border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tayangan & Aplikasi</h3>
                      <p className="text-sm text-muted-foreground mt-2">Performa profil 6 bulan terakhir</p>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="views" fill="#3b82f6" radius={[12, 12, 0, 0]} name="Tayangan" />
                        <Bar dataKey="applications" fill="#a855f7" radius={[12, 12, 0, 0]} name="Aplikasi" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-8 bg-white/70 backdrop-blur-lg border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Keahlian Anda</h3>
                      <p className="text-sm text-muted-foreground mt-2">Distribusi kemampuan</p>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={skillsData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                          {skillsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3">
                      {skillsData.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-medium">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  backgroundColor: COLORS[index % COLORS.length],
                                  width: `${skill.value}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground w-8">{skill.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-8">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Edit Profil</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Lengkapi informasi profil Anda untuk meningkatkan peluang karir</p>
                </div>
                <ProfileForm />
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6 mt-8">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Kelola Dokumen</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Unggah dan kelola file CV, sertifikat, dan portofolio Anda</p>
                </div>
                <DocumentsManager />
              </div>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-8 mt-12">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Lowongan Kerja yang Sesuai</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Temukan peluang karir terbaik berdasarkan keahlian dan pengalaman Anda</p>
                </div>
              </div>
              <div className="grid gap-6">
                {recommendedJobs.map((job, index) => (
                  <Card key={job.id} className="p-8 bg-white/70 backdrop-blur-lg border-border/50 hover:border-primary/50 transition-all duration-500 group hover:shadow-2xl hover:scale-[1.02]" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{job.title}</h3>
                            <p className="text-base text-muted-foreground font-medium">{job.company}</p>
                          </div>
                          <Badge className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm px-4 py-2 shadow-lg flex-shrink-0">{job.match}% cocok</Badge>
                        </div>
                        <div className="space-y-4">
                          <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out shadow-sm" style={{ width: `${job.match}%` }} />
                          </div>
                          <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="font-medium">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                              <Briefcase className="h-4 w-4 text-secondary" />
                              <span className="font-medium">{job.type}</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                              <span>Rp {job.salary}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 flex-shrink-0">
                        <Button
                          size="lg"
                          className="gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-semibold"
                          onClick={() => {
                            alert(`Lamaran dikirim untuk ${job.title} di ${job.company}`);
                          }}
                        >
                          <Send className="h-5 w-5" />
                          Lamar Sekarang
                        </Button>
                        <Button size="lg" variant={liked.includes(job.id) ? "default" : "outline"} className="gap-2 border-2 hover:border-primary transition-all duration-300" onClick={() => toggleLike(job.id)}>
                          <Heart className={`h-5 w-5 ${liked.includes(job.id) ? "fill-current text-red-500" : ""}`} />
                          <span className="font-medium">{liked.includes(job.id) ? "Disukai" : "Sukai"}</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6 mt-8">
              <div className="grid md:grid-cols-3 gap-6 h-[600px]">
                {/* Messages List */}
                <div className="md:col-span-1 space-y-2">
                  {messages.map((msg, i) => (
                    <motion.button
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedCompany(msg)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${selectedCompany?.id === msg.id ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={msg.avatar} />
                            <AvatarFallback>{msg.companyName[0]}</AvatarFallback>
                          </Avatar>
                          {msg.unread > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-xs">{msg.unread}</Badge>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{msg.companyName}</p>
                          <p className="text-xs text-muted-foreground truncate">{msg.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Chat Area */}
                {selectedCompany ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 flex flex-col bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl overflow-hidden shadow-lg">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedCompany.avatar} />
                          <AvatarFallback>{selectedCompany.companyName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{selectedCompany.companyName}</p>
                          <p className="text-xs text-muted-foreground">Perusahaan</p>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-muted rounded-lg">
                        <Phone className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedCompany.avatar} />
                          <AvatarFallback>{selectedCompany.companyName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="max-w-xs bg-muted rounded-xl p-3">
                          <p className="text-sm">{selectedCompany.lastMessage}</p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-border/50">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ketik pesan..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && messageText.trim()) {
                              alert(`Pesan dikirim ke ${selectedCompany.companyName}`);
                              setMessageText("");
                            }
                          }}
                          className="border-2 border-border/50"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (messageText.trim()) {
                              alert(`Pesan dikirim ke ${selectedCompany.companyName}`);
                              setMessageText("");
                            }
                          }}
                          className="px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <Send className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 flex items-center justify-center bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">Pilih percakapan untuk dimulai</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6 mt-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Aktivitas Terbaru</h2>
                <p className="text-muted-foreground">Riwayat interaksi dan perubahan profil Anda</p>
              </div>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <Card key={activity.id} className="p-4 bg-white/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0 p-2 bg-muted rounded-lg">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        <p className="text-xs text-muted-foreground/70 mt-2">{activity.timestamp}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
