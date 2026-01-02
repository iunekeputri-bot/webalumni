import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, LogOut, Plus, Trash2, Search, Edit2, Eye, Check, AlertCircle, Home, Shield, BarChart3, Settings, Briefcase, MapPin, DollarSign, Clock, Building, Download, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL } from "@/config/api";
import echo from "@/lib/echo";
import { useRealtimeAdminUpdates } from "@/hooks/useRealtimeAdminUpdates";

interface Alumni {
  id: string;
  name: string;
  email: string;
  birth_date: string;
  nisn: string;
  phone: string;
  major: string;
  graduation_year: number;
  status: "active" | "inactive" | "pending";
  join_date: string;
  avatar?: string;
}

interface JobPosting {
  id: number;
  title: string;
  location: string;
  company_id: number;
  created_at: string;
  description: string;
  salary_range: string;
  job_type: string;
  requirements: string[];
  status: string;
  company: {
    name: string;
    email?: string;
    avatar?: string;
  };
  applications_count?: number;
}

interface FormData {
  name: string;
  email: string;
  birth_date: string;
  nisn: string;
  phone: string;
  major: string;
  graduation_year: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  useRealtimeAdminUpdates();
  // useRealtimeAlumniUpdates(); // Removed as we are handling it manually here to trigger refresh
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "alumni" | "jobs" | "settings">("overview");
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    birth_date: "",
    nisn: "",
    phone: "",
    major: "",
    graduation_year: new Date().getFullYear().toString(),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Fetch alumni from API
  const fetchAlumni = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      console.log("🔍 Fetching alumni with token:", token ? "Token exists" : "No token");

      const response = await fetch(`${API_URL}/alumni`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("📡 Response status:", response.status);

      if (response.status === 401) {
        console.log("❌ Unauthorized - logging out");
        logout();
        navigate("/admin/auth", { replace: true });
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch alumni");
      const data = await response.json();
      console.log("✅ Alumni data loaded:", data.length, "records");
      console.log("📊 Data preview:", data);
      setAlumni(data);
    } catch (error) {
      console.error("🚨 Error fetching alumni:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data alumni. Pastikan backend berjalan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch job postings
  const fetchJobPostings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/job-postings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch job postings");
      const data = await response.json();
      setJobPostings(data.data || data || []);
    } catch (error) {
      console.error("Error fetching job postings:", error);
    }
  };

  useEffect(() => {
    fetchAlumni();
    fetchJobPostings();

    // Listen for realtime alumni updates
    const channel = echo.channel('alumni-updates');

    channel.listen('AlumniProfileUpdated', (e: any) => {
      console.log('Realtime update received:', e);
      toast({
        title: "Update Data",
        description: `Profil alumni ${e.alumni?.name || ''} telah diperbarui.`,
      });
      fetchAlumni(); // Refresh list
    });

    return () => {
      channel.stopListening('AlumniProfileUpdated');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (value: string) => {
    setFormData((prev) => ({ ...prev, graduation_year: value }));
  };

  const handleAddAlumni = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.birth_date || !formData.nisn || !formData.phone || !formData.major) {
      toast({
        title: "Error",
        description: "Semua field wajib diisi!",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingId ? `${API_URL}/alumni/${editingId}` : `${API_URL}/alumni`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          birth_date: formData.birth_date,
          nisn: formData.nisn,
          phone: formData.phone,
          major: formData.major,
          graduation_year: parseInt(formData.graduation_year),
          status: editingId ? undefined : "active",
        }),
      });

      if (response.status === 401) {
        logout();
        navigate("/admin/auth", { replace: true });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save alumni");
      }

      toast({
        title: "Berhasil!",
        description: editingId ? "Data alumni berhasil diupdate" : "Alumni baru berhasil ditambahkan. Akun user telah dibuat otomatis.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        birth_date: "",
        nisn: "",
        phone: "",
        major: "",
        graduation_year: new Date().getFullYear().toString(),
      });
      setEditingId(null);
      setShowForm(false);

      // Refresh data
      fetchAlumni();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan data alumni";
      console.error("Error saving alumni:", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/alumni/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete alumni");

      toast({
        title: "Berhasil!",
        description: "Alumni berhasil dihapus",
      });

      fetchAlumni();
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting alumni:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus alumni",
        variant: "destructive",
      });
    }
  };

  const handleEditAlumni = (alumnus: Alumni) => {
    setFormData({
      name: alumnus.name,
      email: alumnus.email,
      birth_date: alumnus.birth_date || "",
      nisn: alumnus.nisn || "",
      phone: alumnus.phone || "",
      major: alumnus.major,
      graduation_year: alumnus.graduation_year.toString(),
    });
    setEditingId(alumnus.id);
    setShowForm(true);
    setActiveTab("alumni");
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/alumni/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `alumni_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Gagal mengexport data alumni",
        variant: "destructive",
      });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/alumni/template`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Download template failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "alumni_import_template.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Template download error:", error);
      toast({
        title: "Error",
        description: "Gagal mendownload template",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = [".csv", ".xlsx", ".xls"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validTypes.includes(fileExt)) {
      toast({
        title: "Error",
        description: "File harus berformat CSV, XLS, atau XLSX",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 10MB",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    const formData = new FormData();

    // Force correct MIME type based on file extension
    let correctedFile: File;
    if (fileExt === ".csv") {
      // Always use text/csv for CSV files regardless of browser detection
      correctedFile = new File([file], file.name, { type: "text/csv" });
    } else if (fileExt === ".xlsx") {
      correctedFile = new File([file], file.name, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    } else if (fileExt === ".xls") {
      correctedFile = new File([file], file.name, {
        type: "application/vnd.ms-excel",
      });
    } else {
      correctedFile = file;
    }

    formData.append("file", correctedFile);

    console.log("📤 Uploading file:", {
      name: correctedFile.name,
      size: correctedFile.size,
      type: correctedFile.type,
      originalType: file.type,
      extension: fileExt,
      endpoint: `${API_URL}/alumni/import`,
    });

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login ulang.");
      }

      const response = await fetch(`${API_URL}/alumni/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        const errorMsg = errorData.errors ? Object.values(errorData.errors).flat().join(", ") : errorData.message || "Gagal import";

        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log("✅ Import success:", data);

      toast({
        title: "Import Selesai ✅",
        description: data.message || `Berhasil mengimport ${data.imported || 0} alumni`,
      });

      if (data.success || data.imported > 0) {
        fetchAlumni();
      }
    } catch (error) {
      console.error("🚨 Import error:", error);

      let errorMessage = "Gagal mengimport data alumni";

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "⚠️ CORS Error: Backend tidak merespon. Pastikan:\n1. Backend Laravel berjalan di port 8000\n2. CORS sudah dikonfigurasi di backend/config/cors.php\n3. Route /api/alumni/import sudah ada di routes/api.php";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error Import",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Reset input
      e.target.value = "";
    }
  };

  const filteredAlumni = alumni.filter((a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const stats = {
    total: alumni.length,
    active: alumni.filter((a) => a.status === "active").length,
    pending: alumni.filter((a) => a.status === "pending").length,
    inactive: alumni.filter((a) => a.status === "inactive").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Navigation Header */}
      <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="border-b border-border/50 bg-white/30 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{user?.name || "Administrator"}</p>
                <p className="text-lg font-bold">Administrator</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/")} className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors font-semibold">
                <Home className="h-5 w-5" />
                Kembali ke Beranda
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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "alumni" | "jobs" | "settings")} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto gap-2 bg-white/40 backdrop-blur-xl border border-white/50 p-1 rounded-2xl shadow-lg mb-8">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Ringkasan</span>
              </TabsTrigger>
              <TabsTrigger value="alumni" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Kelola Alumni</span>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden md:inline">Lowongan</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Pengaturan</span>
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
                    value: isLoading ? "..." : stats.total.toString(),
                    desc: "Alumni terdaftar",
                    color: "from-blue-500/20 to-cyan-500/20",
                    textColor: "text-blue-600",
                  },
                  {
                    icon: Check,

                    label: "Alumni Aktif",
                    value: isLoading ? "..." : stats.active.toString(),
                    desc: "Status aktif",
                    color: "from-green-500/20 to-emerald-500/20",
                    textColor: "text-green-600",
                  },
                  {
                    icon: AlertCircle,
                    label: "Pending",
                    value: isLoading ? "..." : stats.pending.toString(),
                    desc: "Menunggu verifikasi",
                    color: "from-yellow-500/20 to-orange-500/20",
                    textColor: "text-yellow-600",
                  },
                  {
                    icon: AlertCircle,
                    label: "Inactive",
                    value: isLoading ? "..." : stats.inactive.toString(),
                    desc: "Status nonaktif",
                    color: "from-red-500/20 to-pink-500/20",
                    textColor: "text-red-600",
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

              {/* Recent Alumni & Distribution */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Alumni */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                    <h3 className="text-lg font-bold mb-6">Alumni Terbaru</h3>
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      ) : alumni.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Belum ada data alumni</p>
                        </div>
                      ) : (
                        alumni.slice(0, 5).map((a, idx) => (
                          <motion.div
                            key={a.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white/60 to-white/40 hover:from-white/80 hover:to-white/60 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-primary/50">
                                <AvatarImage src={a.avatar} alt={a.name} />
                                <AvatarFallback className="bg-primary/20 text-primary">{a.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm">{a.name}</p>
                                <p className="text-xs text-muted-foreground">{a.email}</p>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${a.status === "active" ? "bg-green-500/20 text-green-700" : a.status === "pending" ? "bg-yellow-500/20 text-yellow-700" : "bg-red-500/20 text-red-700"}`}>
                              {a.status === "active" ? "Aktif" : a.status === "pending" ? "Pending" : "Nonaktif"}
                            </span>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </Card>
                </motion.div>

                {/* Distribution by Major */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                    <h3 className="text-lg font-bold mb-6">Distribusi Program Studi</h3>
                    <div className="space-y-4">
                      {Array.from(new Set(alumni.map((a) => a.major))).map((major) => {
                        const count = alumni.filter((a) => a.major === major).length;
                        const percentage = alumni.length > 0 ? (count / alumni.length) * 100 : 0;
                        return (
                          <div key={major}>
                            <div className="mb-1 flex justify-between text-sm">
                              <span className="font-medium">{major}</span>
                              <span className="text-muted-foreground">{count} Alumni</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Job Postings from Companies */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                  <h3 className="text-lg font-bold mb-6">Lowongan Kerja dari Perusahaan</h3>
                  <div className="space-y-3">
                    {jobPostings.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Belum ada lowongan kerja dari perusahaan</p>
                      </div>
                    ) : (
                      jobPostings.slice(0, 5).map((job, idx) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/60 to-white/40 hover:from-white/80 hover:to-white/60 transition-all border border-white/50"
                        >
                          <div className="flex flex-1 gap-3">
                            <div className="h-10 w-10 rounded-lg border border-border/50 overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
                              {/* Use 'any' cast to access logo if not in interface yet, or update interface later */}
                              {(job.company as any).logo ? (
                                <img src={(job.company as any).logo} alt="Logo" className="h-full w-full object-cover" />
                              ) : (
                                <Building className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{job.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{job.company?.name || "Unknown Company"}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-700">📍 {job.location}</span>
                                {job.applications_count !== undefined && <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-700">{job.applications_count} Pelamar</span>}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(job.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* ALUMNI MANAGEMENT TAB */}
            <TabsContent value="alumni" className="space-y-6">
              {/* Action Bar */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari alumni berdasarkan nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-2 border-border/50 focus:border-primary/50 h-11" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2 bg-white/50">
                    <Download className="h-4 w-4" />
                    Template
                  </Button>
                  <Button variant="outline" onClick={handleExport} className="gap-2 bg-white/50">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv,text/csv,application/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleImport}
                    />
                    <Button className="gap-2 bg-[#217346] hover:bg-[#1a5c37] text-white border-0 shadow-md">
                      <Upload className="h-4 w-4" />
                      Import
                    </Button>
                  </div>
                  <Button
                    onClick={() => {
                      setShowForm(!showForm);
                      setEditingId(null);
                      setFormData({
                        name: "",
                        email: "",
                        birth_date: "",
                        nisn: "",
                        phone: "",
                        major: "",
                        graduation_year: new Date().getFullYear().toString(),
                      });
                    }}
                    className="gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Alumni
                  </Button>
                </div>
              </div>

              {/* Form Alumni */}
              <AnimatePresence>
                {showForm && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                      <h3 className="text-xl font-bold mb-6">{editingId ? "Edit Alumni" : "Tambah Alumni Baru"}</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Lengkap *</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama lengkap" className="border-2 border-border/50" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className="border-2 border-border/50" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="birth_date">Tanggal Lahir *</Label>
                          <Input id="birth_date" name="birth_date" type="date" value={formData.birth_date} onChange={handleInputChange} className="border-2 border-border/50" />
                          <p className="text-xs text-muted-foreground">Password default: YYYYMMDD (contoh: 20050115)</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nisn">NISN *</Label>
                          <Input id="nisn" name="nisn" value={formData.nisn} onChange={handleInputChange} placeholder="Masukkan NISN" className="border-2 border-border/50" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Nomor Telepon *</Label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="08123456789" className="border-2 border-border/50" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="major">Program Studi *</Label>
                          <Input id="major" name="major" value={formData.major} onChange={handleInputChange} placeholder="Masukkan program studi" className="border-2 border-border/50" />
                        </div>

                        <div className="space-y-2">
                          <Label>Tahun Lulus *</Label>
                          <Select value={formData.graduation_year} onValueChange={handleYearChange}>
                            <SelectTrigger className="border-2 border-border/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <Button onClick={handleAddAlumni} className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                          <Plus className="mr-2 h-4 w-4" />
                          {editingId ? "Update Alumni" : "Tambah Alumni"}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowForm(false);
                            setEditingId(null);
                            setFormData({
                              name: "",
                              email: "",
                              birth_date: "",
                              nisn: "",
                              phone: "",
                              major: "",
                              graduation_year: new Date().getFullYear().toString(),
                            });
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Batal
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Alumni List */}
              <div className="space-y-3">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : filteredAlumni.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Search className="h-8 w-8 opacity-50" />
                    </div>
                    <p className="text-muted-foreground">Tidak ada alumni ditemukan</p>
                  </div>
                ) : (
                  filteredAlumni.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-xl border border-border/50 bg-white/40 backdrop-blur-xl p-4 transition-all hover:bg-white/60 hover:shadow-md"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <Avatar>
                          <AvatarImage src={a.avatar} alt={a.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">{a.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <p className="truncate font-semibold">{a.name}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] ${a.status === "active" ? "bg-green-500/10 text-green-600" : a.status === "pending" ? "bg-yellow-500/10 text-yellow-600" : "bg-red-500/10 text-red-600"}`}>
                              {a.status === "active" ? "Aktif" : a.status === "pending" ? "Pending" : "Nonaktif"}
                            </span>
                          </div>
                          <p className="truncate text-sm text-muted-foreground">{a.email}</p>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span>{a.major}</span>
                            <span>•</span>
                            <span>{a.graduation_year}</span>
                            <span>•</span>
                            <span>NISN: {a.nisn}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* View Detail */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted hover:text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border-border bg-white">
                            <DialogHeader>
                              <DialogTitle>Detail Alumni</DialogTitle>
                              <DialogDescription>Informasi lengkap alumni</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="mx-auto">
                                <Avatar className="h-20 w-20">
                                  <AvatarImage src={a.avatar} alt={a.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl text-white">{a.name[0]}</AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-xs text-muted-foreground">Nama Lengkap</Label>
                                  <p className="font-medium">{a.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Email</Label>
                                    <p className="font-medium">{a.email}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Status</Label>
                                    <p className="capitalize font-medium">{a.status}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Tanggal Lahir</Label>
                                    <p className="font-medium">{a.birth_date || "-"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">NISN</Label>
                                    <p className="font-medium">{a.nisn || "-"}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Nomor Telepon</Label>
                                  <p className="font-medium">{a.phone || "-"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Program Studi</Label>
                                    <p className="font-medium">{a.major}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-muted-foreground">Tahun Lulus</Label>
                                    <p className="font-medium">{a.graduation_year}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">Tanggal Bergabung</Label>
                                  <p className="font-medium">{new Date(a.join_date).toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Edit */}
                        <Button onClick={() => handleEditAlumni(a)} variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted hover:text-primary">
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        {/* Delete */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button onClick={() => setDeleteId(a.id)} variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-border bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Alumni</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus <span className="font-semibold">{a.name}</span>? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex justify-end gap-3">
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAlumni(a.id)} className="bg-red-600 hover:bg-red-700">
                                Hapus
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* JOBS TAB */}
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari lowongan..." className="pl-10 border-2 border-border/50 focus:border-primary/50 h-11" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobPostings.map((job) => (
                  <motion.div key={job.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="group relative">
                    <Card className="h-full bg-white/40 backdrop-blur-xl border border-white/50 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                            <Building className="h-6 w-6 text-blue-600" />
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{job.status === "open" ? "Aktif" : "Tutup"}</span>
                        </div>

                        <h3 className="font-bold text-lg mb-1 line-clamp-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{job.company.name}</p>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="truncate">{job.salary_range}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{job.job_type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white/50 border-t border-white/50 mt-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md">Lihat Detail</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold flex items-center gap-2">{job.title}</DialogTitle>
                              <DialogDescription className="text-lg text-blue-600 font-medium">{job.company.name}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                  <MapPin className="h-4 w-4" />
                                  {job.location}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                                  <DollarSign className="h-4 w-4" />
                                  {job.salary_range}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                                  <Briefcase className="h-4 w-4" />
                                  {job.job_type}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                  <Briefcase className="h-5 w-5 text-gray-500" />
                                  Deskripsi Pekerjaan
                                </h4>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                              </div>

                              {job.requirements && job.requirements.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-lg flex items-center gap-2">
                                    <Check className="h-5 w-5 text-gray-500" />
                                    Persyaratan
                                  </h4>
                                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                    {Array.isArray(job.requirements) ? (
                                      job.requirements.map((req, i) => <li key={i}>{req}</li>)
                                    ) : (
                                      // Handle case where requirements might be a string (though interface says string[])
                                      <li>{String(job.requirements)}</li>
                                    )}
                                  </ul>
                                </div>
                              )}

                              <div className="pt-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                                <span>Diposting: {new Date(job.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
                                <span>ID Lowongan: #{job.id}</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                <h3 className="text-lg font-bold mb-4">Pengaturan</h3>
                <p className="text-muted-foreground">Fitur pengaturan akan segera hadir.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
