import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  LogOut,
  Home,
  Users,
  Briefcase,
  MessageCircle,
  FileText,
  BarChart3,
  TrendingUp,
  Search,
  Star,
  Send,
  Clock,
  CheckCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  Code,
  MoreVertical,
  Plus,
  X,
  Filter,
  Trash2,
  Download,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useChat } from "@/hooks/useChat";
import { API_URL } from "@/config/api";
// import { usePresence } from "@/hooks/usePresence"; // DISABLED - causing blank screen

interface Alumni {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  status: "siap_bekerja" | "mencari_peluang" | "melanjutkan_pendidikan" | "belum_siap";
  profileCompletion: number;
  avatar: string;
  major: string;
  graduationYear: number;
  bio: string;
  viewed?: boolean;
  contacted?: boolean;
  liked?: boolean;
  admin_name?: string;
  admin_email?: string;
  source_database?: string;
}

interface JobPosting {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  salary: string;
  location: string;
  type: "Full Time" | "Part Time" | "Contract";
  job_type?: string;
  applicants: number;
  views: number;
  createdAt: string;
  status: "active" | "closed" | "open";
}

interface Message {
  id: string;
  alumniId: string;
  alumniName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

interface JobApplication {
  id: number;
  user_id: number;
  alumni_id: number;
  job_posting_id: number;
  cover_letter: string;
  status: "pending" | "viewed" | "accepted" | "rejected";
  created_at: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  alumni: Alumni;
}

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", location: "", salary: "", jobType: "full-time" });
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartsReady, setChartsReady] = useState(false);
  const [canRenderDashboard, setCanRenderDashboard] = useState(false);

  // Presence/Online status - TEMPORARILY DISABLED to prevent blank screen
  // const { onlineUsers, isOnline } = usePresence(user ? parseInt(user.id) : null);
  const onlineUsers: number[] = [];
  const isOnline = (userId: number) => false;

  // Chat hook for unread message count
  const { conversations } = useChat(user ? parseInt(user.id) : null);
  const totalUnreadMessages = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  // Application viewing state
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedJobApplications, setSelectedJobApplications] = useState<JobApplication[]>([]);
  const [selectedJobForApplications, setSelectedJobForApplications] = useState<JobPosting | null>(null);

  // State for data
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [companyName, setCompanyName] = useState(user?.name || "");

  const token = localStorage.getItem("token");
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  });

  // Ensure dashboard always loads via hard refresh to avoid chart DOM errors after login navigation
  useEffect(() => {
    if (typeof window === "undefined" || typeof performance === "undefined") {
      setCanRenderDashboard(true);
      return;
    }

    const navigationEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const navType = navigationEntries[0]?.type || "navigate";
    const RELOAD_FLAG = "companyDashboardReloadedOnce";

    if (navType === "navigate" && sessionStorage.getItem(RELOAD_FLAG) !== "true") {
      sessionStorage.setItem(RELOAD_FLAG, "true");
      window.location.replace(window.location.href);
      return;
    }

    sessionStorage.removeItem(RELOAD_FLAG);
    setCanRenderDashboard(true);

    return () => {
      sessionStorage.removeItem(RELOAD_FLAG);
    };
  }, []);

  // Fetch company data, alumni, and jobs
  useEffect(() => {
    if (!canRenderDashboard) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        let jobsData: JobPosting[] = [];

        // Fetch company info
        const companyRes = await fetch(`${API_URL}/company/me`, {
          headers: getHeaders(),
        });
        if (companyRes.ok) {
          const companyData = await companyRes.json();
          setCompanyName(companyData.name);
        }

        // Fetch alumni data from all admin databases
        const alumniRes = await fetch(`${API_URL}/company/alumni`, {
          headers: getHeaders(),
        });
        if (!alumniRes.ok) throw new Error("Failed to fetch alumni");
        const alumniResponse = await alumniRes.json();
        const alumniData = alumniResponse.data || [];

        // Hitung profileCompletion dinamis
        const totalFields = 8; // id, name, email, phone, skills, status, major, graduationYear
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedData: Alumni[] = alumniData.map((alum: any) => {
          let filled = 0;
          if (alum.user_id || alum.id) filled++;
          if (alum.name) filled++;
          if (alum.email) filled++;
          if (alum.phone) filled++;
          if (Array.isArray(alum.skills) && alum.skills.length > 0) filled++;
          if (alum.work_status) filled++;
          if (alum.major) filled++;
          if (alum.graduation_year) filled++;
          const profileCompletion = Math.round((filled / totalFields) * 100);
          const alumName = String(alum.name || "");
          return {
            id: String(alum.user_id || alum.id),
            name: alum.name,
            email: alum.email,
            phone: alum.phone || "N/A",
            skills: Array.isArray(alum.skills) ? alum.skills : [],
            status: alum.work_status || "siap_bekerja",
            profileCompletion,
            avatar: alum.avatar || `https://avatar.vercel.sh/${alumName.replace(/\s+/g, "")}`,
            major: alum.major,
            graduationYear: alum.graduation_year,
            bio: alum.bio || `Alumni dari ${alum.major}, lulus tahun ${alum.graduation_year}`,
            viewed: false,
            contacted: false,
            liked: false,
            admin_name: alum.admin_name,
            admin_email: alum.admin_email,
            source_database: alum.source_database,
          };
        });

        setAlumni(transformedData);

        // Fetch company's job postings
        const jobsRes = await fetch(`${API_URL}/company/jobs`, {
          headers: getHeaders(),
        });
        if (jobsRes.ok) {
          jobsData = await jobsRes.json();
          setJobs(jobsData);
        }

        const institutionCount = new Set(transformedData.map((a) => a.admin_name).filter(Boolean)).size;
        toast({
          title: "Data Dimuat! ✅",
          description: `${transformedData.length} alumni dari ${institutionCount} institusi & ${jobsData.length} lowongan berhasil dimuat`,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data. Pastikan backend berjalan.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRenderDashboard]);

  useEffect(() => {
    const timer = window.setTimeout(() => setChartsReady(true), 150);
    return () => window.clearTimeout(timer);
  }, []);

  // Auto-close modal when switching away from alumni or messages tab
  useEffect(() => {
    if (activeTab !== "alumni" && activeTab !== "messages") {
      setSelectedAlumni(null);
    }
  }, [activeTab]);

  if (!canRenderDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-primary/40 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Menyiapkan dashboard perusahaan...</p>
        </div>
      </div>
    );
  }

  // Calculate stats for charts - based on actual data
  const statusCounts = {
    siap_bekerja: alumni.filter((a) => a.status === "siap_bekerja").length,
    mencari_peluang: alumni.filter((a) => a.status === "mencari_peluang").length,
    melanjutkan_pendidikan: alumni.filter((a) => a.status === "melanjutkan_pendidikan").length,
    belum_siap: alumni.filter((a) => a.status === "belum_siap").length,
  };

  // Chart data: Status distribution
  const statsData = [
    { name: "Siap Bekerja", alumni: statusCounts.siap_bekerja, aplikasi: jobs.length },
    { name: "Mencari Peluang", alumni: statusCounts.mencari_peluang, aplikasi: Math.max(jobs.length - 1, 0) },
    { name: "Lanjut Pendidikan", alumni: statusCounts.melanjutkan_pendidikan, aplikasi: 0 },
    { name: "Belum Siap", alumni: statusCounts.belum_siap, aplikasi: 0 },
  ];

  // Calculate skills frequency
  const skillCounts: Record<string, number> = {};
  alumni.forEach((alum) => {
    alum.skills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });
  const skillsData = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill, count]) => ({ name: skill, value: count }));

  const COLORS = ["#3b82f6", "#ec4899", "#8b5cf6", "#f59e0b", "#10b981"];
  const hasStatsData = statsData.some((item) => item.alumni > 0 || item.aplikasi > 0);
  const hasSkillsData = skillsData.length > 0;

  const handleContactAlumni = (alumniId: string) => {
    const selectedAlum = alumni.find((a) => a.id === alumniId);
    if (selectedAlum) {
      setSelectedAlumni(selectedAlum);
      setActiveTab("messages");
      toast({
        title: "Chat Dibuka! 💬",
        description: `Mulai percakapan dengan ${selectedAlum.name}`,
      });
    }
  };

  const handleViewCV = async (userId: string | number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/alumni/${userId}/cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // If backend returns PDF directly
        if (contentType?.includes("application/pdf") || contentType?.includes("application/octet-stream")) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");

          toast({
            title: "Sukses ✅",
            description: "CV dibuka di tab baru",
          });
        }
        // If backend returns JSON with URL
        else if (contentType?.includes("application/json")) {
          const data = await response.json();
          if (data.cv_url) {
            window.open(data.cv_url, "_blank");
            toast({
              title: "Sukses ✅",
              description: "CV dibuka di tab baru",
            });
          } else {
            toast({
              title: "Info",
              description: "Alumni belum mengupload CV",
            });
          }
        }
      } else if (response.status === 404) {
        toast({
          title: "Info",
          description: "Alumni belum mengupload CV",
        });
      } else {
        toast({
          title: "Error",
          description: "Gagal mengambil CV",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("View CV error:", error);
      toast({
        title: "Error",
        description: "Gagal membuka CV. Pastikan backend berjalan.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCV = async (userId: string | number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/alumni/${userId}/cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // If backend returns PDF directly
        if (contentType?.includes("application/pdf") || contentType?.includes("application/octet-stream")) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `CV_Alumni_${userId}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          toast({
            title: "Sukses ✅",
            description: "CV berhasil didownload",
          });
        }
        // If backend returns JSON with URL
        else if (contentType?.includes("application/json")) {
          const data = await response.json();
          if (data.cv_url) {
            const downloadResponse = await fetch(data.cv_url, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (downloadResponse.ok) {
              const blob = await downloadResponse.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = data.file_name || `CV_Alumni_${userId}.pdf`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);

              toast({
                title: "Sukses ✅",
                description: "CV berhasil didownload",
              });
            }
          } else {
            toast({
              title: "Info",
              description: "Alumni belum mengupload CV",
            });
          }
        }
      } else if (response.status === 404) {
        toast({
          title: "Info",
          description: "Alumni belum mengupload CV",
        });
      } else {
        toast({
          title: "Error",
          description: "Gagal mengambil CV",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Download CV error:", error);
      toast({
        title: "Error",
        description: "Gagal download CV. Pastikan backend berjalan.",
        variant: "destructive",
      });
    }
  };

  const handlePostJob = async () => {
    if (!newJob.title || !newJob.location || !newJob.salary) {
      toast({
        title: "Error",
        description: "Lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingJobId ? `${API_URL}/job-postings/${editingJobId}` : `${API_URL}/job-postings`;

      const method = editingJobId ? "PUT" : "POST";

      console.log("📝 Posting job:", {
        url,
        method,
        data: {
          title: newJob.title,
          location: newJob.location,
          salary: newJob.salary,
          job_type: newJob.jobType,
        },
      });

      const response = await fetch(url, {
        method: method,
        headers: getHeaders(),
        body: JSON.stringify({
          title: newJob.title,
          description: `Lowongan untuk posisi ${newJob.title} di ${newJob.location}`,
          location: newJob.location,
          salary: newJob.salary,
          job_type: newJob.jobType,
          requirements: [],
          status: "open",
        }),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Server error:", errorData);
        throw new Error(errorData.message || `Failed to ${editingJobId ? "update" : "post"} job`);
      }

      const savedJob = await response.json();
      console.log("✅ Job saved:", savedJob);

      if (editingJobId) {
        setJobs(jobs.map((j) => (j.id === editingJobId ? savedJob : j)));
        toast({
          title: "Sukses! 🎉",
          description: "Lowongan berhasil diperbarui",
        });
      } else {
        setJobs([savedJob, ...jobs]);
        toast({
          title: "Lowongan Berhasil Diposting! 🎉",
          description: `${newJob.title} telah ditambahkan ke database`,
        });
      }

      setNewJob({ title: "", location: "", salary: "", jobType: "full-time" });
      setEditingJobId(null);
      setShowJobForm(false);
    } catch (error) {
      console.error("🚨 Error posting job:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menyimpan lowongan",
        variant: "destructive",
      });
    }
  };

  const handleEditJob = (job: JobPosting) => {
    setNewJob({
      title: job.title,
      location: job.location,
      salary: job.salary,
      jobType: job.job_type || "full-time",
    });
    setEditingJobId(job.id);
    setShowJobForm(true);
  };

  const handleViewApplications = async (job: JobPosting) => {
    try {
      setSelectedJobForApplications(job);
      const response = await fetch(`${API_URL}/job-postings/${job.id}/applications`, {
        headers: getHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedJobApplications(data);
        setShowApplicationsModal(true);
      } else {
        throw new Error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Gagal memuat aplikasi lamaran",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) return;

    try {
      const response = await fetch(`${API_URL}/job-postings/${jobId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to delete job");

      setJobs(jobs.filter((j) => j.id !== jobId));
      toast({
        title: "Sukses",
        description: "Lowongan berhasil dihapus",
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus lowongan",
        variant: "destructive",
      });
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: number, newStatus: "accepted" | "rejected" | "viewed") => {
    try {
      const response = await fetch(`${API_URL}/applications/${applicationId}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update application status");

      // Update local state
      setSelectedJobApplications(selectedJobApplications.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)));

      toast({
        title: "Sukses",
        description: `Lamaran berhasil ${newStatus === "accepted" ? "diterima" : "ditolak"}`,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status lamaran",
        variant: "destructive",
      });
    }
  };

  const filteredAlumni = alumni.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Navigation Header */}
      <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="border-b border-border/50 bg-white/30 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Perusahaan</p>
                <p className="text-lg font-bold">{companyName}</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab("overview")} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Home className="h-5 w-5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold">
                <LogOut className="h-4 w-4" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto gap-2 bg-white/40 backdrop-blur-xl border border-white/50 p-1 rounded-2xl shadow-lg mb-8">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Ringkasan</span>
              </TabsTrigger>
              <TabsTrigger value="alumni" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Alumni</span>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden md:inline">Lowongan</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2 relative">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline">Pesan</span>
                {totalUnreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">{totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}</span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-8">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    icon: Users,
                    label: "Total Alumni",
                    value: alumni.length.toString(),
                    desc: `Dari ${new Set(alumni.map((a) => a.admin_name).filter(Boolean)).size} institusi`,
                    color: "from-blue-500/20 to-cyan-500/20",
                    textColor: "text-blue-600",
                  },
                  {
                    icon: Briefcase,
                    label: "Lowongan Aktif",
                    value: jobs.filter((j) => j.status === "open").length.toString(),
                    desc: `${jobs.length} total lowongan`,
                    color: "from-purple-500/20 to-pink-500/20",
                    textColor: "text-purple-600",
                  },
                  {
                    icon: TrendingUp,
                    label: "Top Skills",
                    value: new Set(alumni.flatMap((a) => a.skills)).size.toString(),
                    desc: "skill yang berbeda",
                    color: "from-orange-500/20 to-red-500/20",
                    textColor: "text-orange-600",
                  },
                  {
                    icon: MessageCircle,
                    label: "Alumni Siap",
                    value: alumni.filter((a) => a.status === "siap_bekerja").length.toString(),
                    desc: "siap bekerja",
                    color: "from-green-500/20 to-emerald-500/20",
                    textColor: "text-green-600",
                  },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className={`p-6 bg-gradient-to-br ${stat.color} border border-white/50 hover:shadow-lg transition-all duration-300`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                          <p className="text-3xl font-bold mt-2">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-2">{stat.desc}</p>
                        </div>
                        <div className={`h-10 w-10 rounded-lg bg-white/60 flex items-center justify-center ${stat.textColor}`}>
                          <stat.icon className="h-5 w-5" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                    <h3 className="text-lg font-bold mb-6">Alumni by Status & Job Postings</h3>
                    {chartsReady && !isLoading && hasStatsData ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.1} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="alumni" fill="#3b82f6" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                          <Bar dataKey="aplikasi" fill="#ec4899" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        <div className="text-center space-y-2">
                          <div className="animate-pulse">{isLoading ? "Memuat data..." : "Data belum tersedia"}</div>
                          {!isLoading && <p className="text-xs">Coba periksa kembali nanti setelah ada data alumni.</p>}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                <div>
                  <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                    <h3 className="text-lg font-bold mb-6">Top Skills Alumni</h3>
                    {chartsReady && !isLoading && hasSkillsData ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={skillsData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value" isAnimationActive={false}>
                            {skillsData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        <div className="text-center space-y-2">
                          <div className="animate-pulse">{isLoading ? "Memuat keahlian..." : "Data keahlian belum tersedia"}</div>
                          {!isLoading && <p className="text-xs">Tambahkan data alumni untuk melihat distribusi keahlian.</p>}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>

              {/* Alumni Distribution by Institution */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                  <h3 className="text-lg font-bold mb-6">Distribusi Alumni per Institusi</h3>
                  <div className="space-y-3">
                    {Array.from(new Set(alumni.map((a) => a.admin_name).filter(Boolean)))
                      .map((adminName) => {
                        const count = alumni.filter((a) => a.admin_name === adminName).length;
                        const percentage = (count / alumni.length) * 100;
                        return { name: adminName, count, percentage };
                      })
                      .sort((a, b) => b.count - a.count)
                      .map((admin, i) => (
                        <motion.div key={admin.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">{i + 1}</div>
                              <span className="font-semibold">{admin.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {admin.count} alumni ({admin.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${admin.percentage}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }} className="h-full bg-gradient-to-r from-primary to-secondary" />
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </Card>
              </motion.div>

              {/* Top Alumni */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                  <h3 className="text-lg font-bold mb-6">Alumni Terbaik</h3>
                  <div className="space-y-4">
                    {alumni.slice(0, 3).map((alum, i) => (
                      <motion.div
                        key={alum.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/60 to-white/40 hover:from-white/80 hover:to-white/60 transition-all duration-300 border border-white/50"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="h-12 w-12 border-2 border-primary/50 shadow-lg">
                            <AvatarImage src={alum.avatar} />
                            <AvatarFallback>{alum.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold">{alum.name}</p>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {alum.skills.slice(0, 2).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedAlumni(alum);
                            setActiveTab("alumni");
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          Lihat Detail
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* ALUMNI TAB */}
            <TabsContent value="alumni" className="space-y-6">
              <div className="flex gap-4 flex-col md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari alumni berdasarkan nama atau skill..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 border-2 border-border/50 focus:border-primary/50 h-11" />
                </div>
                <Button className="gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-xl">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map((alum, i) => (
                  <motion.div key={alum.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="overflow-hidden bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <Avatar className="h-16 w-16 border-3 border-primary/50 shadow-lg">
                            <AvatarImage src={alum.avatar} />
                            <AvatarFallback>{alum.name[0]}</AvatarFallback>
                          </Avatar>
                          <motion.button whileHover={{ scale: 1.2, rotate: 90 }} onClick={() => setSelectedAlumni(alum)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </motion.button>
                        </div>

                        <div>
                          <h4 className="font-bold text-lg">{alum.name}</h4>
                          <p className="text-sm text-muted-foreground">{alum.major}</p>
                          <p className="text-xs text-gray-500 mt-1">Lulus {alum.graduationYear}</p>
                          {alum.admin_name && (
                            <div className="flex items-center gap-1 mt-2">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                📚 {alum.admin_name}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {alum.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} className="bg-primary/20 text-primary border-primary/50">
                              {skill}
                            </Badge>
                          ))}
                          {alum.skills.length > 3 && <Badge variant="outline">+{alum.skills.length - 3}</Badge>}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Status Kesiapan</span>
                            <Badge
                              className={
                                alum.status === "siap_bekerja"
                                  ? "bg-green-500/20 text-green-700"
                                  : alum.status === "mencari_peluang"
                                  ? "bg-blue-500/20 text-blue-700"
                                  : alum.status === "melanjutkan_pendidikan"
                                  ? "bg-purple-500/20 text-purple-700"
                                  : "bg-gray-500/20 text-gray-700"
                              }
                            >
                              {alum.status === "siap_bekerja" ? "✓ Siap Bekerja" : alum.status === "mencari_peluang" ? "🔍 Mencari Peluang" : alum.status === "melanjutkan_pendidikan" ? "🎓 Melanjutkan Pendidikan" : "⏳ Belum Siap"}
                            </Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all" style={{ width: `${alum.profileCompletion}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground">{alum.profileCompletion}% Profile Lengkap</p>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-border/50">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedAlumni(alum)}
                            className="flex-1 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold rounded-lg hover:from-primary/20 hover:to-secondary/20 transition-all gap-2 flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm hidden md:inline">Lihat Detail</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleContactAlumni(alum.id)}
                            className="flex-1 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all gap-2 flex items-center justify-center"
                          >
                            <Send className="h-4 w-4" />
                            <span className="text-sm hidden md:inline">Hubungi</span>
                          </motion.button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* JOBS TAB */}
            <TabsContent value="jobs" className="space-y-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowJobForm(!showJobForm)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Post Lowongan Baru
              </motion.button>

              <AnimatePresence>
                {showJobForm && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <Card className="p-6 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">{editingJobId ? "Edit Lowongan" : "Post Lowongan Baru"}</h3>
                        <button
                          onClick={() => {
                            setShowJobForm(false);
                            setEditingJobId(null);
                            setNewJob({ title: "", location: "", salary: "", jobType: "full-time" });
                          }}
                          className="p-1 hover:bg-muted rounded-lg transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <Input placeholder="Judul Pekerjaan" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="border-2 border-border/50" />
                        <Input placeholder="Lokasi" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} className="border-2 border-border/50" />
                        <Input placeholder="Range Gaji (misal: 5-8 Juta)" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} className="border-2 border-border/50" />
                        <select
                          value={newJob.jobType}
                          onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                          className="w-full px-4 py-2.5 border-2 border-border/50 rounded-md bg-background focus:border-primary/50 focus:outline-none transition-colors"
                        >
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                        </select>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowJobForm(false);
                              setEditingJobId(null);
                              setNewJob({ title: "", location: "", salary: "", jobType: "full-time" });
                            }}
                            className="flex-1"
                          >
                            Batal
                          </Button>
                          <Button onClick={handlePostJob} className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                            {editingJobId ? "Update" : "Post"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                {jobs.map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="p-6 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl border border-white/50 hover:shadow-lg transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </Badge>
                            <Badge variant="outline">{job.type}</Badge>
                            <Badge className="bg-green-500/20 text-green-700">{job.salary}</Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </motion.button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDeleteJob(job.id)} className="text-red-600 focus:text-red-600 cursor-pointer">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus Lowongan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-muted-foreground mb-4">{job.description}</p>

                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50 mb-4">
                        <div>
                          <p className="text-2xl font-bold">{job.applicants}</p>
                          <p className="text-xs text-muted-foreground">Aplikasi</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{job.views}</p>
                          <p className="text-xs text-muted-foreground">Dilihat</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-600">✓ Aktif</p>
                          <p className="text-xs text-muted-foreground">{job.createdAt}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => handleEditJob(job)}>
                          Edit
                        </Button>
                        <Button className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold" onClick={() => handleViewApplications(job)}>
                          Lihat Aplikasi
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* MESSAGES TAB */}
            <TabsContent value="messages">
              <ChatLayout currentUserId={user ? parseInt(user.id) : 0} selectedAlumni={selectedAlumni} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Alumni Detail Modal */}
        <AnimatePresence>
          {selectedAlumni && activeTab === "alumni" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAlumni(null)} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-border/50 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Detail Alumni</h2>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedAlumni(null)} className="p-2 hover:bg-muted rounded-lg">
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-24 w-24 border-4 border-primary/50 shadow-lg">
                      <AvatarImage src={selectedAlumni.avatar} />
                      <AvatarFallback className="text-2xl">{selectedAlumni.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold">{selectedAlumni.name}</h3>
                      <p className="text-muted-foreground text-lg">{selectedAlumni.major}</p>
                      <div className="flex gap-3 mt-3">
                        <Badge className="bg-green-500/20 text-green-700">Lulus {selectedAlumni.graduationYear}</Badge>
                        <Badge
                          className={
                            selectedAlumni.status === "siap_bekerja"
                              ? "bg-green-500/20 text-green-700"
                              : selectedAlumni.status === "mencari_peluang"
                              ? "bg-blue-500/20 text-blue-700"
                              : selectedAlumni.status === "melanjutkan_pendidikan"
                              ? "bg-purple-500/20 text-purple-700"
                              : "bg-gray-500/20 text-gray-700"
                          }
                        >
                          {selectedAlumni.status === "siap_bekerja"
                            ? "✓ Siap Bekerja"
                            : selectedAlumni.status === "mencari_peluang"
                            ? "🔍 Mencari Peluang"
                            : selectedAlumni.status === "melanjutkan_pendidikan"
                            ? "🎓 Melanjutkan Pendidikan"
                            : "⏳ Belum Siap"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-semibold flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedAlumni.email}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Telepon</p>
                      <p className="font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedAlumni.phone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tentang</p>
                    <p className="leading-relaxed">{selectedAlumni.bio}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Skills ({selectedAlumni.skills.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAlumni.skills.map((skill) => (
                        <Badge key={skill} className="bg-primary/20 text-primary border-primary/50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Kelengkapan Profil</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full" style={{ width: `${selectedAlumni.profileCompletion}%` }} />
                      </div>
                      <p className="font-semibold">{selectedAlumni.profileCompletion}%</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border/50">
                    <Button onClick={() => handleViewCV(selectedAlumni.id)} variant="outline" className="flex-1 gap-2">
                      <FileText className="h-4 w-4" />
                      Lihat CV
                    </Button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleContactAlumni(selectedAlumni.id)}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all gap-2 flex items-center justify-center"
                    >
                      <Send className="h-4 w-4" />
                      Hubungi Sekarang
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Applications Modal */}
        <AnimatePresence>
          {showApplicationsModal && selectedJobForApplications && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowApplicationsModal(false)} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5">
                  <div>
                    <h2 className="text-2xl font-bold">Aplikasi Masuk</h2>
                    <p className="text-muted-foreground">Untuk posisi: {selectedJobForApplications.title}</p>
                  </div>
                  <button onClick={() => setShowApplicationsModal(false)} className="p-2 hover:bg-muted rounded-lg">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="overflow-y-auto p-6">
                  {selectedJobApplications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>Belum ada pelamar untuk posisi ini.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedJobApplications.map((app) => (
                        <div key={app.id} className="border border-border/50 rounded-xl p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={app.user.avatar} />
                                <AvatarFallback>{app.user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-bold text-lg">{app.user.name}</h4>
                                <p className="text-sm text-muted-foreground">{app.user.email}</p>
                                <p className="text-xs text-muted-foreground mt-1">Melamar pada: {new Date(app.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                              </div>
                            </div>
                            <Badge
                              className={
                                app.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-700"
                                  : app.status === "accepted"
                                  ? "bg-green-500/20 text-green-700"
                                  : app.status === "rejected"
                                  ? "bg-red-500/20 text-red-700"
                                  : "bg-blue-500/20 text-blue-700"
                              }
                            >
                              {app.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="mt-4 bg-muted/30 p-4 rounded-lg">
                            <p className="text-sm font-medium mb-2">Cover Letter:</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{app.cover_letter}</p>
                          </div>

                          <div className="flex gap-2 mt-4 justify-end flex-wrap">
                            <Button variant="outline" size="sm" onClick={() => handleDownloadCV(app.user_id)} className="gap-2">
                              <Download className="h-4 w-4" />
                              Download CV
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleContactAlumni(String(app.user_id))}>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Chat
                            </Button>
                            {app.status === "pending" && (
                              <>
                                <Button size="sm" variant="destructive" onClick={() => handleUpdateApplicationStatus(app.id, "rejected")}>
                                  <X className="h-4 w-4 mr-2" />
                                  Tolak
                                </Button>
                                <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white" onClick={() => handleUpdateApplicationStatus(app.id, "accepted")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Terima
                                </Button>
                              </>
                            )}
                            {app.status !== "pending" && (
                              <Badge className={app.status === "accepted" ? "bg-green-500/20 text-green-700 px-4 py-2" : "bg-red-500/20 text-red-700 px-4 py-2"}>{app.status === "accepted" ? "✓ Diterima" : "✗ Ditolak"}</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyDashboard;
