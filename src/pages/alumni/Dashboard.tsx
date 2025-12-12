import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/config/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, FileText, Briefcase, Eye, Clock, Target, CheckCircle2, Share2, Edit, LogOut, Home, MessageCircle, Award } from "lucide-react";
import ProfileForm from "./ProfileForm";
import DocumentsManager from "./DocumentsManager";
import JobListings from "./JobListings";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useChat } from "@/hooks/useChat";

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
  actionUrl?: string;
}

interface Application {
  id: number;
  status: string;
  created_at: string;
  job_posting?: {
    title?: string;
    company?: {
      name?: string;
    };
  };
}

interface ProfileDetails {
  name?: string;
  email?: string;
  skills?: string[];
  major?: string;
  filled_fields?: number;
  total_fields?: number;
  missing_fields?: string[];
  [key: string]: unknown;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [applicationsData, setApplicationsData] = useState<Application[]>([]);
  const [chartData, setChartData] = useState(() => {
    // Initialize with current 6 months data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      months.push(monthNames[monthIndex]);
    }
    return months.map((month) => ({ month, views: 0, applications: 0 }));
  });
  const [skillsData, setSkillsData] = useState<{ name: string; value: number }[]>(() => {
    // Load from cache for instant display
    const cached = localStorage.getItem("cached_skills");
    return cached ? JSON.parse(cached) : [];
  });

  // Initialize user ID for chat
  const alumniUserId = typeof user?.id === "string" ? parseInt(user.id) : user?.id || 1;
  const { conversations } = useChat(alumniUserId);
  const totalUnread = Array.isArray(conversations) ? conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0) : 0;

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplicationsData(data);

        const newActivities: Activity[] = data.map((app: Application) => ({
          id: app.id.toString(),
          type: "job",
          title: `Melamar ke ${app.job_posting?.company?.name || "Perusahaan"}`,
          description: `Posisi: ${app.job_posting?.title || "Unknown"} - Status: ${app.status}`,
          timestamp: new Date(app.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          icon: <Briefcase className="h-5 w-5 text-white" />,
          actionUrl: "/alumni/applications",
        }));
        setActivities(newActivities);

        // Generate chart data from applications
        generateChartData(data);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  const generateChartData = (applications: Application[]) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const months = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      months.push(monthNames[monthIndex]);
    }

    const newChartData = months.map((month, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12;
      const monthApplications = applications.filter((app: Application) => {
        const appDate = new Date(app.created_at);
        return appDate.getMonth() === monthIndex && appDate.getFullYear() === new Date().getFullYear();
      });

      return {
        month,
        views: Math.max(0, Math.floor(Math.random() * 50) + monthApplications.length * 2),
        applications: Math.max(0, monthApplications.length),
      };
    });

    console.log("Generated chart data:", newChartData); // Debug log
    setChartData(newChartData);
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocumentsCount(data.length || 0);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/job-postings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const jobs = data.data || data;
        setJobsCount(jobs.length || 0);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const [profileCompletion, setProfileCompletion] = useState(() => {
    // Load from cache immediately for instant display
    const cached = localStorage.getItem("profile_completion");
    return cached ? parseInt(cached) : 0;
  });
  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);

  useEffect(() => {
    document.title = "Dashboard Alumni - Alumni Connect Hub";
    fetchActivities();
    fetchProfileData(); // This will update cache in background
    fetchDocuments();
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/alumni/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const completion = data.profile_completion || 0;
        setProfileCompletion(completion);
        // Cache for next load
        localStorage.setItem("profile_completion", completion.toString());
        setProfileDetails(data.profile_completion_details);

        // Generate skills data from profile
        if (data.skills && data.skills.length > 0) {
          const skills = data.skills.slice(0, 4).map((skill: string, index: number) => ({
            name: skill,
            value: 85 - index * 10,
          }));
          setSkillsData(skills);
          localStorage.setItem("cached_skills", JSON.stringify(skills));
        } else if (data.major) {
          // Fallback: generate from major
          const fallbackSkills = [
            { name: data.major, value: 85 },
            { name: "Komunikasi", value: 75 },
            { name: "Teamwork", value: 70 },
            { name: "Problem Solving", value: 65 },
          ];
          setSkillsData(fallbackSkills);
          localStorage.setItem("cached_skills", JSON.stringify(fallbackSkills));
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  const stats: StatCard[] = [
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Dokumen",
      value: documentsCount.toString(),
      description: "File tersimpan",
      color: "from-blue-500/20 to-cyan-500/20 border-blue-200 dark:border-blue-900",
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      label: "Aplikasi",
      value: applicationsData.length.toString(),
      description: "Total lamaran",
      color: "from-purple-500/20 to-pink-500/20 border-purple-200 dark:border-purple-900",
    },
    {
      icon: <Eye className="h-5 w-5" />,
      label: "Tayangan",
      value: Math.floor(profileCompletion * 0.5).toString(),
      description: "Profil dilihat",
      color: "from-orange-500/20 to-red-500/20 border-orange-200 dark:border-orange-900",
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: "Kesempatan",
      value: jobsCount.toString(),
      description: "Lowongan tersedia",
      color: "from-green-500/20 to-emerald-500/20 border-green-200 dark:border-green-900",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Pesan",
      value: totalUnread.toString(),
      description: "Pesan belum dibaca",
      color: "from-indigo-500/20 to-cyan-500/20 border-indigo-200 dark:border-indigo-900",
    },
  ];

  const COLORS = ["#3b82f6", "#a855f7", "#ec4899", "#f59e0b"];

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

      {/* Hero Section */}
      <section className="border-b bg-white dark:bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col gap-10 rounded-[32px] border border-border/50 bg-gradient-to-br from-white via-muted/40 to-white dark:from-background dark:via-background/60 dark:to-background shadow-xl px-6 py-10 sm:px-10 lg:flex-row lg:items-center">
            <motion.div className="flex-1 space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-sm font-semibold text-primary">
                <Award className="h-4 w-4" />
                Dashboard Alumni
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
                  Selamat datang, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user?.name?.split(" ")[0] || "Alumni"}</span>
                </h1>
                <p className="text-base text-muted-foreground sm:text-lg">Pantau progres karir dan lanjutkan langkah berikutnya tanpa harus membuka banyak menu.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setActiveTab("profile")} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Lengkapi Profil
                </Button>
                <Button variant="secondary" onClick={() => setActiveTab("jobs")} className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Lihat Lowongan
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("messages")} className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Pesan
                  {totalUnread > 0 && <Badge className="ml-1 bg-red-500 text-white">{totalUnread}</Badge>}
                </Button>
              </div>
            </motion.div>

            <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card className="rounded-3xl border border-border/40 p-6 shadow-lg">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Kelengkapan profil</p>
                      <p className="text-3xl font-bold">{profileCompletion}%</p>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 font-medium">
                      Target 80%
                    </Badge>
                  </div>
                  <Progress value={profileCompletion} className="h-3" />
                  {profileDetails?.missing_fields && profileDetails.missing_fields.length > 0 ? (
                    <div className="rounded-2xl border border-dashed border-orange-200 p-4 text-sm">
                      <p className="mb-3 font-semibold text-orange-600">Perlu dilengkapi:</p>
                      <div className="flex flex-wrap gap-2">
                        {profileDetails.missing_fields.slice(0, 3).map((field: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                        {profileDetails.missing_fields.length > 3 && <Badge variant="outline">+{profileDetails.missing_fields.length - 3}</Badge>}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">Profil Anda sudah terlihat profesional. Pastikan data tetap terbaru.</div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-auto gap-2 bg-white/40 backdrop-blur-xl border border-white/50 p-1 rounded-2xl shadow-lg mb-8">
              <TabsTrigger value="overview" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden md:inline">Ringkasan</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <Edit className="h-4 w-4" />
                <span className="hidden md:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Dokumen</span>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden md:inline">Lowongan</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2 relative">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline">Pesan</span>
                {totalUnread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">{totalUnread > 99 ? "99+" : totalUnread}</span>}
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden md:inline">Aktivitas</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8 mt-8">
              {/* Enhanced Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/50 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-blue-900/70 dark:hover:to-indigo-800/70 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Eye className="h-6 w-6" />
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold">+12%</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{jobsCount}</p>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Lowongan Tersedia</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Temukan peluang karir baru</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50 hover:from-green-100 hover:to-emerald-200 dark:hover:from-green-900/70 dark:hover:to-emerald-800/70 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 font-semibold">Aktif</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">{applicationsData.length}</p>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">Lamaran Dikirim</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Pantau status aplikasi Anda</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/50 dark:to-violet-900/50 hover:from-purple-100 hover:to-violet-200 dark:hover:from-purple-900/70 dark:hover:to-violet-800/70 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <FileText className="h-6 w-6" />
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold">{documentsCount}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{documentsCount}</p>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Dokumen Upload</p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">Kelola dokumen Anda</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/50 dark:to-amber-900/50 hover:from-orange-100 hover:to-amber-200 dark:hover:from-orange-900/70 dark:hover:to-amber-800/70 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <TrendingUp className="h-6 w-6" />
                        </div>
                        <Badge className={`font-semibold ${profileCompletion >= 80 ? "bg-green-500/20 text-green-700" : profileCompletion >= 60 ? "bg-yellow-500/20 text-yellow-700" : "bg-red-500/20 text-red-700"}`}>
                          {profileCompletion}%
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{profileCompletion}%</p>
                        <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Profil Lengkap</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400">Tingkatkan visibilitas</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Charts Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-8 bg-white/70 backdrop-blur-lg border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tayangan & Aplikasi</h3>
                      <p className="text-sm text-muted-foreground mt-2">Performa profil 6 bulan terakhir</p>
                    </div>
                    {chartData && chartData.length > 0 ? (
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
                    ) : (
                      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <div className="animate-pulse mb-2">Memuat data chart...</div>
                          <p className="text-sm">Chart akan muncul setelah data dimuat</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-8 bg-white/70 backdrop-blur-lg border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Keahlian Anda</h3>
                      <p className="text-sm text-muted-foreground mt-2">Distribusi kemampuan</p>
                    </div>
                    {skillsData.length > 0 ? (
                      <>
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
                      </>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <div className="animate-pulse">Memuat keahlian...</div>
                        </div>
                      </div>
                    )}
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
              <JobListings />
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="mt-8">
              <ChatLayout currentUserId={alumniUserId} />
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6 mt-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Aktivitas Terbaru</h2>
                <p className="text-muted-foreground">Riwayat interaksi dan perubahan profil Anda</p>
              </div>
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <Card className="p-8 text-center bg-muted/30">
                    <p className="text-muted-foreground">Belum ada aktivitas.</p>
                  </Card>
                ) : (
                  activities.map((activity, index) => (
                    <Card key={activity.id} className="p-4 bg-white/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex-shrink-0 p-2 bg-primary/10 rounded-lg">{activity.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          <p className="text-xs text-muted-foreground/70 mt-2">{activity.timestamp}</p>
                        </div>
                        {activity.actionUrl && (
                          <Button size="sm" variant="outline" onClick={() => navigate(`/alumni/applications/${activity.id}`)}>
                            Lihat Aplikasi
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
