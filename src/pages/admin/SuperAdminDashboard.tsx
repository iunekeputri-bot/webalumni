import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Plus, Trash2, RefreshCw, Database, Check, Users, BookOpen, Briefcase, Eye, EyeOff, LogOut, X, Home, BarChart3, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useMaintenance } from "@/context/MaintenanceContext";
import { API_URL } from "@/config/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "company" | "alumni";
  created_at: string;
}

interface Alumni {
  id: number;
  name: string;
  email: string;
  major?: string;
  graduation_year?: number;
  status: string;
  skills?: string[];
  created_at: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  sender_name?: string;
  receiver_name?: string;
  content: string;
  created_at: string;
}

interface JobPosting {
  id: number;
  company_id: number;
  company_name?: string;
  title: string;
  description: string;
  location?: string;
  salary_range?: string;
  created_at: string;
}

interface Application {
  id: number;
  alumni_id: number;
  job_posting_id: number;
  alumni_name?: string;
  job_title?: string;
  status: string;
  created_at: string;
}

interface Stats {
  total_users: number;
  total_alumni: number;
  total_messages: number;
  total_job_postings: number;
  total_applications: number;
  users_by_role?: Array<{ role: string; count: number }>;
}

const SUPER_ADMIN_SECRET = "superadmin2024secure";
const SUPER_ADMIN_EMAIL = "superadmin@example.com";

interface SystemResources {
  cpu_usage: number;
  memory_usage: number;
  storage_usage: number;
  uptime: string;
  db_latency?: number;
  network_latency?: number;
}

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { setMaintenanceMode: setGlobalMaintenanceMode } = useMaintenance();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accessKey = queryParams.get("access");

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "data" | "monitoring" | "database" | "settings">("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [loginLoading, setLoginLoading] = useState(false);
  // ... (keep other states normal, just adding loginLoading and isCheckingAuth)

  // Validate super admin access
  useEffect(() => {
    const validateAccess = async () => {
      setIsCheckingAuth(true);

      // 1. Check if user is logged in as super admin
      if (user && user.role === "admin" && user.email === SUPER_ADMIN_EMAIL) {
        setIsAuthorized(true);
        setIsCheckingAuth(false);
        return;
      }

      // 2. Check if accessed via secret key (validate with backend)
      if (accessKey) {
        try {
          // Use maintenance status endpoint as a lightweight verification
          const response = await fetch(`${API_URL}/super-admin/maintenance-status?superadmin_key=${accessKey}`, {
            headers: {
              'Accept': 'application/json',
              'X-Super-Admin-Key': accessKey
            }
          });

          if (response.ok) {
            setIsAuthorized(true);
            console.log("✅ Super Admin access validated via backend");
          } else {
            setIsAuthorized(false);
            toast({ title: "Akses Ditolak", description: "Key URL tidak valid/kadaluarsa", variant: "destructive" });
          }
        } catch (e) {
          console.error("Validation error", e);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }

      setIsCheckingAuth(false);
    };

    validateAccess();
  }, [user, navigate, accessKey]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [systemResources, setSystemResources] = useState<SystemResources>({
    cpu_usage: 0,
    memory_usage: 0,
    storage_usage: 0,
    uptime: "Offline",
    db_latency: 0,
    network_latency: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Poll system resources
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchResources = async () => {
      try {
        const url = new URL(`${API_URL}/super-admin/system-resources`);
        if (accessKey === SUPER_ADMIN_SECRET) {
          url.searchParams.append("superadmin_key", SUPER_ADMIN_SECRET);
        }
        const response = await fetch(url.toString(), {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setSystemResources(data);
        }
      } catch (error) {
        console.error("Error fetching system resources:", error);
      }
    };

    fetchResources(); // Fetch immediately
    const interval = setInterval(fetchResources, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [isAuthorized, accessKey]);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  // Modal states removed - using tabs instead
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingAlumni, setIsLoadingAlumni] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(false);

  // Pagination states
  const [alumniPage, setAlumniPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [jobsPage, setJobsPage] = useState(1);
  const [appsPage, setAppsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Maintenance mode state
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [maintenanceEndDate, setMaintenanceEndDate] = useState("");
  const [maintenanceEndTime, setMaintenanceEndTime] = useState("");
  const [maintenanceMessage, setMaintenanceMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin" as "admin" | "company",
  });





  // Fetch maintenance mode status
  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const url = new URL(`${API_URL}/super-admin/maintenance-status`);
        if (accessKey === SUPER_ADMIN_SECRET) {
          url.searchParams.append("superadmin_key", SUPER_ADMIN_SECRET);
        }
        const response = await fetch(url.toString(), {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setIsMaintenanceMode(data.maintenance_mode || false);
        }
      } catch (error) {
        console.error("Error fetching maintenance status:", error);
      }
    };

    if (isAuthorized) {
      fetchMaintenanceStatus();
    }
  }, [isAuthorized, accessKey]);

  // Show dialog when turning on, directly toggle when turning off
  const handleMaintenanceToggle = () => {
    if (isMaintenanceMode) {
      // Turning off - no dialog needed
      toggleMaintenanceMode();
    } else {
      // Turning on - show dialog
      setShowMaintenanceDialog(true);
    }
  };

  // Toggle maintenance mode
  const toggleMaintenanceMode = async () => {
    setIsTogglingMaintenance(true);
    try {
      const url = new URL(`${API_URL}/super-admin/toggle-maintenance`);
      if (accessKey === SUPER_ADMIN_SECRET) {
        url.searchParams.append("superadmin_key", SUPER_ADMIN_SECRET);
      }
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          enabled: !isMaintenanceMode,
          end_date: maintenanceEndDate,
          end_time: maintenanceEndTime,
          message: maintenanceMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsMaintenanceMode(data.maintenance_mode);
        // Update global maintenance context for real-time update
        setGlobalMaintenanceMode(data);
        setShowMaintenanceDialog(false);
        // Reset form
        setMaintenanceEndDate("");
        setMaintenanceEndTime("");
        setMaintenanceMessage("");
        toast({
          title: "Sukses",
          description: `Maintenance mode ${data.maintenance_mode ? "diaktifkan" : "dinonaktifkan"}`,
        });
      } else {
        throw new Error("Failed to toggle maintenance mode");
      }
    } catch (error) {
      console.error("Error toggling maintenance mode:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah mode maintenance",
        variant: "destructive",
      });
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  // Helper function to get auth headers (token or secret key)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else if (accessKey === SUPER_ADMIN_SECRET) {
      // Gunakan secret key di header untuk identifikasi
      headers["X-Super-Admin-Key"] = SUPER_ADMIN_SECRET;
    }

    return headers;
  };

  // Fetch all data functions
  const fetchAlumni = async () => {
    setIsLoadingAlumni(true);
    try {
      console.log("Fetching alumni...");
      const url = new URL(`${API_URL}/super-admin/alumni`);
      if (accessKey === SUPER_ADMIN_SECRET) {
        url.searchParams.append("superadmin_key", SUPER_ADMIN_SECRET);
      }
      const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      console.log("Alumni response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Alumni data:", data);
        setAlumni(data.data || data || []);
        toast({
          title: "Sukses",
          description: `${data.data?.length || 0} alumni dimuat`,
        });
      } else {
        const errorData = await response.json();
        console.error("Alumni fetch error:", errorData);
        toast({
          title: "Error",
          description: `Gagal memuat alumni: ${errorData.message || response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching alumni:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data alumni",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAlumni(false);
    }
  };

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      console.log("Fetching messages...");
      const url = new URL(`${API_URL}/super-admin/messages`);
      if (accessKey === SUPER_ADMIN_SECRET) {
        url.searchParams.append("superadmin_key", SUPER_ADMIN_SECRET);
      }
      const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      console.log("Messages response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Messages data:", data);
        setMessages(data.data || data || []);
        toast({
          title: "Sukses",
          description: `${data.data?.length || 0} pesan dimuat`,
        });
      } else {
        const errorData = await response.json();
        console.error("Messages fetch error:", errorData);
        toast({
          title: "Error",
          description: `Gagal memuat pesan: ${errorData.message || response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data pesan",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const fetchJobPostings = async () => {
    setIsLoadingJobs(true);
    try {
      console.log("Fetching job postings...");
      const url = new URL(`${API_URL}/super-admin/job-postings`);
      if (accessKey === SUPER_ADMIN_SECRET) {
        url.searchParams.append("superadmin_key", SUPER_ADMIN_SECRET);
      }
      const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      console.log("Job postings response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Job postings data:", data);
        setJobPostings(data.data || data || []);
        toast({
          title: "Sukses",
          description: `${data.data?.length || 0} lowongan dimuat`,
        });
      } else {
        const errorData = await response.json();
        console.error("Job postings fetch error:", errorData);
        toast({
          title: "Error",
          description: `Gagal memuat lowongan: ${errorData.message || response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching job postings:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data lowongan",
        variant: "destructive",
      });
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const fetchApplications = async () => {
    setIsLoadingApps(true);
    try {
      console.log("Fetching applications...");
      const url = new URL(`${API_URL}/super-admin/applications`);
      if (accessKey === SUPER_ADMIN_SECRET) {
        url.searchParams.append("superadmin_key", SUPER_ADMIN_SECRET);
      }
      const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      console.log("Applications response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Applications data:", data);
        setApplications(data.data || data || []);
        toast({
          title: "Sukses",
          description: `${data.data?.length || 0} aplikasi dimuat`,
        });
      } else {
        const errorData = await response.json();
        console.error("Applications fetch error:", errorData);
        toast({
          title: "Error",
          description: `Gagal memuat aplikasi: ${errorData.message || response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data aplikasi",
        variant: "destructive",
      });
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Load initial data with useCallback
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();

      console.log("🚀 Loading initial data...");

      // Build URLs with secret key if needed
      const usersUrl = new URL(`${API_URL}/super-admin/users`);
      const statsUrl = new URL(`${API_URL}/super-admin/stats`);

      if (accessKey === SUPER_ADMIN_SECRET) {
        usersUrl.searchParams.append("superadmin_key", SUPER_ADMIN_SECRET);
        statsUrl.searchParams.append("superadmin_key", SUPER_ADMIN_SECRET);
      }

      // Fetch users and stats
      const [usersRes, statsRes] = await Promise.all([fetch(usersUrl.toString(), { headers }), fetch(statsUrl.toString(), { headers })]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.data || []);
        console.log("✅ Users loaded:", data.data?.length);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        // Exclude alumni from total_users count (only count admin, company, superadmin)
        const totalUsersExcludingAlumni = data.total_users - data.total_alumni;
        setStats({
          ...data,
          total_users: totalUsersExcludingAlumni,
        });
        console.log("✅ Stats loaded");
      }

      // Fetch all data immediately on component mount
      console.log("📊 Fetching all data sections...");
      await Promise.all([fetchAlumni(), fetchMessages(), fetchJobPostings(), fetchApplications()]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount only if authorized
  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }
  }, [isAuthorized, loadData]);

  const handleLogout = () => {
    // If accessed via URL, just clear the key to show lock screen
    if (accessKey) {
      setIsAuthorized(false);
      navigate("/admin/super-admin", { replace: true });
      return;
    }

    if (user?.role === "admin" && user?.email === SUPER_ADMIN_EMAIL) {
      logout();
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Semua field harus diisi",
          variant: "destructive",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Password tidak cocok",
          variant: "destructive",
        });
        return;
      }

      const { confirmPassword, ...submitData } = formData;

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/super-admin/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Create user error:", error);

        // Handle Laravel validation errors
        if (error.errors) {
          const errorMessages = Object.values(error.errors).flat().join(', ');
          throw new Error(errorMessages);
        }

        throw new Error(error.message || "Gagal membuat user");
      }

      const data = await response.json();

      // Show notification dari backend jika ada
      if (data.notification) {
        const { type, title, message } = data.notification;
        toast({
          title,
          description: message,
          variant: type === "error" ? "destructive" : "default",
        });
      } else {
        // Fallback notification
        toast({
          title: "Sukses",
          description: `${formData.role} berhasil dibuat`,
        });
      }

      // Add the new user with password to the list
      if (data.user) {
        setUsers([...users, data.user]);
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "admin",
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowCreateForm(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal membuat user",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) {
      toast({
        title: "Peringatan",
        description: "Pilih minimal 1 user untuk dihapus",
        variant: "destructive",
      });
      return;
    }

    // Check if super admin is in the selection
    const SUPER_ADMIN_EMAIL = "superadmin@example.com";
    const selectedUsers = users.filter((u) => selectedUserIds.includes(u.id));
    const hasSuperAdmin = selectedUsers.some((u) => u.role === "admin" && u.email === SUPER_ADMIN_EMAIL);

    if (hasSuperAdmin) {
      toast({
        title: "Tidak Diizinkan",
        description: "Super Admin tidak bisa dihapus. Silakan hapus centang pada Super Admin.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedUserIds.length} user(s)? Database admin juga akan dihapus!`)) {
      return;
    }

    setIsDeleting(true);
    const token = localStorage.getItem("token");
    let successCount = 0;
    let failCount = 0;

    try {
      for (const userId of selectedUserIds) {
        try {
          const response = await fetch(`${API_URL}/super-admin/users/${userId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
          });

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }

      // Refresh user list
      await loadData();
      setSelectedUserIds([]);

      toast({
        title: "Selesai",
        description: `${successCount} user berhasil dihapus${failCount > 0 ? `, ${failCount} gagal` : ""}`,
        variant: successCount > 0 ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u.id));
    }
  };

  const handleDeleteUser = async (userId: number) => {
    // Prevent deleting super admin
    const SUPER_ADMIN_EMAIL = "superadmin@example.com";
    const userToDelete = users.find((u) => u.id === userId);

    if (userToDelete && userToDelete.role === "admin" && userToDelete.email === SUPER_ADMIN_EMAIL) {
      toast({
        title: "Tidak Diizinkan",
        description: "Super Admin tidak bisa dihapus",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Yakin hapus user ini?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/super-admin/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Gagal hapus user");

      toast({
        title: "Sukses",
        description: "User berhasil dihapus",
      });

      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal hapus user",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = async () => {
    if (!confirm("⚠️ Ini akan menghapus SEMUA data! Lanjutkan?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/super-admin/clear-all`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Gagal clear data");

      toast({
        title: "Sukses",
        description: "Semua data berhasil dihapus",
      });

      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal clear data",
        variant: "destructive",
      });
    }
  };

  const handleBackup = async () => {
    try {
      const token = localStorage.getItem("token");

      toast({
        title: "Memproses...",
        description: "Membuat backup database...",
      });

      const response = await fetch(`${API_URL}/super-admin/backup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal membuat backup");
      }

      const data = await response.json();

      toast({
        title: "Sukses!",
        description: data.message || "Backup database berhasil dibuat",
      });

      // If backend returns backup file, trigger download
      if (data.backup_file) {
        const downloadUrl = `${API_URL}/super-admin/backup/download/${data.backup_file}`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = data.backup_file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Backup error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal membuat backup database",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async () => {
    // Create file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".sql,.zip";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!confirm(`⚠️ Restore database dari file "${file.name}"? Ini akan mengganti data yang ada!`)) {
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("backup_file", file);

        toast({
          title: "Memproses...",
          description: "Merestore database...",
        });

        const response = await fetch(`${API_URL}/super-admin/restore`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Gagal restore database");
        }

        const data = await response.json();

        toast({
          title: "Sukses!",
          description: data.message || "Database berhasil direstore",
        });

        // Reload data after restore
        await loadData();
      } catch (error) {
        console.error("Restore error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Gagal restore database",
          variant: "destructive",
        });
      }
    };

    input.click();
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin inline-block h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isAuthorized ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Super Admin Login</CardTitle>
              <CardDescription>Masukkan Access Key untuk melanjutkan</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoginLoading(true);
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('key') as HTMLInputElement;
                const key = input.value;

                try {
                  const response = await fetch(`${API_URL}/super-admin/maintenance-status?superadmin_key=${key}`, {
                    headers: {
                      'Accept': 'application/json',
                      'X-Super-Admin-Key': key
                    }
                  });

                  if (response.ok) {
                    // Valid key, redirect
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set("access", key);
                    window.location.href = newUrl.toString();
                  } else {
                    toast({
                      title: "Akses Ditolak",
                      description: "Key tidak valid",
                      variant: "destructive"
                    });
                  }
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Gagal memverifikasi key",
                    variant: "destructive"
                  });
                } finally {
                  setLoginLoading(false);
                }
              }}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Access Key</Label>
                    <Input id="key" name="key" type="password" placeholder="Masukkan secret key..." disabled={loginLoading} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? "Memverifikasi..." : "Login"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/admin/auth')}>
                    Login via Admin Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
          {/* Navigation Header */}
          <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="border-b border-border/50 bg-white/30 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
                  <motion.div
                    animate={{ boxShadow: ["0 0 20px rgba(59, 130, 246, 0.5)", "0 0 30px rgba(59, 130, 246, 0.8)", "0 0 20px rgba(59, 130, 246, 0.5)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
                  >
                    <Shield className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-muted-foreground">{user?.name || "Super Admin"}</p>
                    <p className="text-lg font-bold">SUPER ADMIN</p>
                  </div>
                </motion.div>

                <div className="flex items-center gap-4">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/")} className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors font-semibold">
                    <Home className="h-5 w-5" />
                    Beranda
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
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "users" | "data" | "monitoring" | "database" | "settings")} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 bg-white/40 backdrop-blur-xl border border-white/50 p-1 rounded-2xl shadow-lg mb-8">
                  <TabsTrigger value="overview" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden md:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden md:inline">Users</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="gap-2">
                    <Database className="h-4 w-4" />
                    <span className="hidden md:inline">Data</span>
                  </TabsTrigger>

                  <TabsTrigger value="database" className="gap-2">
                    <Database className="h-4 w-4" />
                    <span className="hidden md:inline">Database</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden md:inline">Settings</span>
                  </TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-8">
                  {/* Stats Cards */}
                  {stats && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-5 gap-6">
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-2xl">
                          <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100 pb-2">
                            <div className="flex items-center justify-between">
                              <Users className="h-8 w-8 text-blue-600" />
                              <div className="text-right">
                                <CardDescription className="text-xs font-semibold text-blue-600">TOTAL USERS</CardDescription>
                                <CardTitle className="text-3xl font-black text-blue-700">{stats.total_users}</CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="overflow-hidden border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-2xl">
                          <CardHeader className="bg-gradient-to-br from-green-50 to-green-100 pb-2">
                            <div className="flex items-center justify-between">
                              <Users className="h-8 w-8 text-green-600" />
                              <div className="text-right">
                                <CardDescription className="text-xs font-semibold text-green-600">TOTAL ALUMNI</CardDescription>
                                <CardTitle className="text-3xl font-black text-green-700">{alumni.length}</CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-2xl">
                          <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 pb-2">
                            <div className="flex items-center justify-between">
                              <BookOpen className="h-8 w-8 text-purple-600" />
                              <div className="text-right">
                                <CardDescription className="text-xs font-semibold text-purple-600">MESSAGES</CardDescription>
                                <CardTitle className="text-3xl font-black text-purple-700">{stats.total_messages}</CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="overflow-hidden border-2 border-red-200 hover:border-red-400 transition-all hover:shadow-2xl">
                          <CardHeader className="bg-gradient-to-br from-red-50 to-red-100 pb-2">
                            <div className="flex items-center justify-between">
                              <Briefcase className="h-8 w-8 text-red-600" />
                              <div className="text-right">
                                <CardDescription className="text-xs font-semibold text-red-600">JOB POSTINGS</CardDescription>
                                <CardTitle className="text-3xl font-black text-red-700">{stats.total_job_postings}</CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="overflow-hidden border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-2xl">
                          <CardHeader className="bg-gradient-to-br from-orange-50 to-orange-100 pb-2">
                            <div className="flex items-center justify-between">
                              <Check className="h-8 w-8 text-orange-600" />
                              <div className="text-right">
                                <CardDescription className="text-xs font-semibold text-orange-600">APPLICATIONS</CardDescription>
                                <CardTitle className="text-3xl font-black text-orange-700">{stats.total_applications}</CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
                  {/* System Monitoring Section */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-2 gap-6 mt-8">
                    <Card className="border-2 border-blue-100/50 shadow-md">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          System Monitoring
                        </CardTitle>
                        <CardDescription>Monitor kesehatan dan performa sistem</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                          <Card className="bg-blue-50/30 border-blue-100">
                            <CardHeader className="pb-3 p-4">
                              <CardDescription className="text-xs">Server Status</CardDescription>
                              <CardTitle className="text-xl text-green-600 flex items-center gap-1">
                                <span className="relative flex h-3 w-3 mr-1">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                Online
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-xs text-muted-foreground">Uptime: {systemResources.uptime}</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-green-50/30 border-green-100">
                            <CardHeader className="pb-3 p-4">
                              <CardDescription className="text-xs">Database Speed</CardDescription>
                              <CardTitle className={`text-xl ${!systemResources.db_latency || systemResources.db_latency < 0 ? 'text-red-500' : systemResources.db_latency < 100 ? 'text-green-600' : 'text-orange-500'}`}>
                                {systemResources.db_latency && systemResources.db_latency > 0 ? `${systemResources.db_latency}ms` : 'Check...'}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-xs text-muted-foreground">Query Latency</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-cyan-50/30 border-cyan-100">
                            <CardHeader className="pb-3 p-4">
                              <CardDescription className="text-xs">Internet Speed</CardDescription>
                              <CardTitle className={`text-xl ${!systemResources.network_latency ? 'text-gray-500' : systemResources.network_latency < 100 ? 'text-green-600' : 'text-orange-500'}`}>
                                {systemResources.network_latency ? `${systemResources.network_latency}ms` : 'Ping...'}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-xs text-muted-foreground">Main Server Latency</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-purple-50/30 border-purple-100">
                            <CardHeader className="pb-3 p-4">
                              <CardDescription className="text-xs">Active Users</CardDescription>
                              <CardTitle className="text-xl text-purple-600">{stats?.total_users || 0}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-xs text-muted-foreground">Registered Accounts</p>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-orange-100/50 shadow-md">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-orange-600" />
                          System Resources
                        </CardTitle>
                        <CardDescription>Penggunaan resource server (Realtime)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> CPU Usage</span>
                              <span className="text-sm text-muted-foreground">{systemResources.cpu_usage}%</span>
                            </div>
                            <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${systemResources.cpu_usage}%` }} transition={{ duration: 0.5 }} className="bg-blue-500 h-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></motion.div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Memory Usage</span>
                              <span className="text-sm text-muted-foreground">{systemResources.memory_usage}%</span>
                            </div>
                            <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${systemResources.memory_usage}%` }} transition={{ duration: 0.5 }} className="bg-green-500 h-2 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></motion.div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Storage Usage</span>
                              <span className="text-sm text-muted-foreground">{systemResources.storage_usage}%</span>
                            </div>
                            <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${systemResources.storage_usage}%` }} transition={{ duration: 0.5 }} className="bg-orange-500 h-2 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></motion.div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* USERS TAB */}
                <TabsContent value="users" className="space-y-6">
                  {/* Create User Form */}
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-white/90 via-white/80 to-primary/5 backdrop-blur-xl shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-3 text-2xl">
                            <motion.div
                              whileHover={{ rotate: 90, scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
                            >
                              <Plus className="h-6 w-6 text-white" />
                            </motion.div>
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">Buat User Baru</span>
                          </CardTitle>
                          <CardDescription className="text-base mt-2 ml-13">Admin SMK atau Perusahaan</CardDescription>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2 border-2 border-primary/50 hover:bg-primary/10 font-semibold">
                            {showCreateForm ? (
                              <>
                                <X className="h-4 w-4" /> Tutup
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4" /> Buka Form
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </CardHeader>

                    <AnimatePresence>
                      {showCreateForm && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                          <CardContent className="pt-0">
                            <form onSubmit={handleCreateUser} className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
                                  <Label className="text-base font-semibold flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    Nama *
                                  </Label>
                                  <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nama lengkap"
                                    className="border-2 border-border/50 focus:border-primary/50 h-11 text-base bg-white/50 backdrop-blur-sm transition-all duration-300"
                                  />
                                </motion.div>

                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-2">
                                  <Label className="text-base font-semibold">Email *</Label>
                                  <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@example.com"
                                    className="border-2 border-border/50 focus:border-primary/50 h-11 text-base bg-white/50 backdrop-blur-sm transition-all duration-300"
                                  />
                                </motion.div>

                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
                                  <Label className="text-base font-semibold">Password *</Label>
                                  <div className="relative">
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      value={formData.password}
                                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                      placeholder="Minimal 6 karakter"
                                      className="border-2 border-border/50 focus:border-primary/50 h-11 text-base pr-10 bg-white/50 backdrop-blur-sm transition-all duration-300"
                                    />
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </motion.button>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Minimal 6 karakter</p>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="space-y-2">
                                  <Label className="text-base font-semibold">Konfirmasi Password *</Label>
                                  <div className="relative">
                                    <Input
                                      type={showConfirmPassword ? "text" : "password"}
                                      value={formData.confirmPassword}
                                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                      placeholder="Ulangi password"
                                      className="border-2 border-border/50 focus:border-primary/50 h-11 text-base pr-10 bg-white/50 backdrop-blur-sm transition-all duration-300"
                                    />
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      type="button"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </motion.button>
                                  </div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2 space-y-2">
                                  <Label className="text-base font-semibold">Role *</Label>
                                  <Select value={formData.role} onValueChange={(value: string) => setFormData({ ...formData, role: value as "admin" | "company" })}>
                                    <SelectTrigger className="border-2 border-border/50 focus:border-primary/50 h-11 text-base bg-white/50 backdrop-blur-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="admin">Admin SMK</SelectItem>
                                      <SelectItem value="company">Perusahaan</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </motion.div>
                              </div>

                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                                <Button
                                  type="submit"
                                  disabled={isSaving}
                                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                                >
                                  {isSaving ? (
                                    <>
                                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                                      Menyimpan...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="h-5 w-5 mr-2" />
                                      Buat User
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                            </form>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>

                  {/* Users List */}
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Daftar Users ({users.filter((u) => u.role !== "alumni").length})
                          </CardTitle>
                          <CardDescription>Pilih user untuk hapus massal atau klik untuk detail</CardDescription>
                        </div>
                        {selectedUserIds.length > 0 && (
                          <Button variant="destructive" onClick={handleBulkDelete} disabled={isDeleting} className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            Hapus {selectedUserIds.length} User{selectedUserIds.length > 1 ? "s" : ""}
                            {isDeleting && <div className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full ml-2" />}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                        </div>
                      ) : users.filter((u) => u.role !== "alumni").length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">Belum ada user</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-bold w-12">
                                  <input
                                    type="checkbox"
                                    checked={selectedUserIds.length === users.filter((u) => u.role !== "alumni").length && users.filter((u) => u.role !== "alumni").length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 cursor-pointer"
                                  />
                                </th>
                                <th className="text-left py-3 px-4 font-bold">Nama</th>
                                <th className="text-left py-3 px-4 font-bold">Email</th>
                                <th className="text-left py-3 px-4 font-bold">Role</th>
                                <th className="text-left py-3 px-4 font-bold">Dibuat</th>
                                <th className="text-left py-3 px-4 font-bold">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users
                                .filter((u) => u.role !== "alumni")
                                .map((user) => {
                                  const SUPER_ADMIN_EMAIL = "superadmin@example.com";
                                  const isSuperAdmin = user.role === "admin" && user.email === SUPER_ADMIN_EMAIL;

                                  return (
                                    <tr key={user.id} className="border-b hover:bg-muted/50 transition">
                                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={() => toggleUserSelection(user.id)} className="w-4 h-4 cursor-pointer" />
                                      </td>
                                      <td className="py-3 px-4 cursor-pointer" onClick={() => setSelectedUser(user)}>
                                        {user.name}
                                        {isSuperAdmin && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold">SUPER</span>}
                                      </td>
                                      <td className="py-3 px-4 text-muted-foreground cursor-pointer" onClick={() => setSelectedUser(user)}>
                                        {user.email}
                                      </td>
                                      <td className="py-3 px-4 cursor-pointer" onClick={() => setSelectedUser(user)}>
                                        <span
                                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${isSuperAdmin
                                            ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 border-2 border-blue-300"
                                            : user.role === "admin"
                                              ? "bg-blue-100 text-blue-700"
                                              : user.role === "alumni"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-purple-100 text-purple-700"
                                            }`}
                                        >
                                          {isSuperAdmin ? "Super Admin" : user.role === "admin" ? "Admin SMK" : user.role === "alumni" ? "Alumni" : "Perusahaan"}
                                        </span>
                                      </td>
                                      <td className="py-3 px-4 text-sm text-muted-foreground cursor-pointer" onClick={() => setSelectedUser(user)}>
                                        {new Date(user.created_at).toLocaleDateString("id-ID")}
                                      </td>
                                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                        {!isSuperAdmin && (
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteUser(user.id);
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        )}
                                        {isSuperAdmin && <span className="text-xs text-muted-foreground italic">Protected</span>}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* DATA TAB */}
                <TabsContent value="data" className="space-y-6">
                  {/* Alumni Section */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <Users className="h-5 w-5" />
                        Daftar Alumni
                      </CardTitle>
                      <CardDescription>Total {alumni.length} alumni terdaftar</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isLoadingAlumni ? (
                        <div className="text-center py-8">
                          <div className="animate-spin inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                          <p className="text-muted-foreground mt-2">Memuat data alumni...</p>
                        </div>
                      ) : alumni.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Belum ada data alumni</p>
                          <Button onClick={fetchAlumni} className="mt-4" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Muat Data Alumni
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-3 px-4 font-bold">Nama</th>
                                  <th className="text-left py-3 px-4 font-bold">Email</th>
                                  <th className="text-left py-3 px-4 font-bold">Jurusan</th>
                                  <th className="text-left py-3 px-4 font-bold">Tahun Lulus</th>
                                  <th className="text-left py-3 px-4 font-bold">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {alumni.slice((alumniPage - 1) * ITEMS_PER_PAGE, alumniPage * ITEMS_PER_PAGE).map((alum) => (
                                  <tr key={alum.id} className="border-b hover:bg-muted/50 transition">
                                    <td className="py-3 px-4">{alum.name}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{alum.email}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{alum.major || "-"}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{alum.graduation_year || "-"}</td>
                                    <td className="py-3 px-4">
                                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${alum.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{alum.status}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                              Menampilkan {(alumniPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(alumniPage * ITEMS_PER_PAGE, alumni.length)} dari {alumni.length}
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setAlumniPage(Math.max(1, alumniPage - 1))} disabled={alumniPage === 1}>
                                ← Sebelumnya
                              </Button>
                              <span className="flex items-center px-3 py-2 text-sm font-medium">
                                {alumniPage} / {Math.ceil(alumni.length / ITEMS_PER_PAGE)}
                              </span>
                              <Button variant="outline" size="sm" onClick={() => setAlumniPage(alumniPage + 1)} disabled={alumniPage >= Math.ceil(alumni.length / ITEMS_PER_PAGE)}>
                                Berikutnya →
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Messages Section */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-600">
                        <BookOpen className="h-5 w-5" />
                        Daftar Messages
                      </CardTitle>
                      <CardDescription>Total {messages.length} pesan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isLoadingMessages ? (
                        <div className="text-center py-8">
                          <div className="animate-spin inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                          <p className="text-muted-foreground mt-2">Memuat data pesan...</p>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Belum ada pesan</p>
                          <Button onClick={fetchMessages} className="mt-4" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Muat Data Messages
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3">
                            {messages.slice((messagesPage - 1) * ITEMS_PER_PAGE, messagesPage * ITEMS_PER_PAGE).map((msg) => (
                              <div key={msg.id} className="p-4 bg-muted/30 rounded-lg border">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="text-sm">
                                    <span className="font-semibold">{msg.sender_name || `User #${msg.sender_id}`}</span>
                                    <span className="text-muted-foreground mx-2">→</span>
                                    <span className="font-semibold">{msg.receiver_name || `User #${msg.receiver_id}`}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString("id-ID")}</span>
                                </div>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                              Menampilkan {(messagesPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(messagesPage * ITEMS_PER_PAGE, messages.length)} dari {messages.length}
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setMessagesPage(Math.max(1, messagesPage - 1))} disabled={messagesPage === 1}>
                                ← Sebelumnya
                              </Button>
                              <span className="flex items-center px-3 py-2 text-sm font-medium">
                                {messagesPage} / {Math.ceil(messages.length / ITEMS_PER_PAGE)}
                              </span>
                              <Button variant="outline" size="sm" onClick={() => setMessagesPage(messagesPage + 1)} disabled={messagesPage >= Math.ceil(messages.length / ITEMS_PER_PAGE)}>
                                Berikutnya →
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Job Postings Section */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <Briefcase className="h-5 w-5" />
                        Daftar Job Postings
                      </CardTitle>
                      <CardDescription>Total {jobPostings.length} lowongan kerja</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isLoadingJobs ? (
                        <div className="text-center py-8">
                          <div className="animate-spin inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                          <p className="text-muted-foreground mt-2">Memuat data lowongan...</p>
                        </div>
                      ) : jobPostings.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Belum ada lowongan kerja</p>
                          <Button onClick={fetchJobPostings} className="mt-4" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Muat Data Lowongan
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3">
                            {jobPostings.slice((jobsPage - 1) * ITEMS_PER_PAGE, jobsPage * ITEMS_PER_PAGE).map((job) => (
                              <div key={job.id} className="p-4 bg-muted/30 rounded-lg border">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg">{job.title}</h3>
                                    <p className="text-muted-foreground text-sm">{job.company_name || `Company #${job.company_id}`}</p>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{new Date(job.created_at).toLocaleDateString("id-ID")}</span>
                                </div>
                                <p className="text-sm mb-2">{job.description}</p>
                                {job.location && <p className="text-muted-foreground text-xs">📍 {job.location}</p>}
                                {job.salary_range && <p className="text-muted-foreground text-xs">💰 {job.salary_range}</p>}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                              Menampilkan {(jobsPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(jobsPage * ITEMS_PER_PAGE, jobPostings.length)} dari {jobPostings.length}
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setJobsPage(Math.max(1, jobsPage - 1))} disabled={jobsPage === 1}>
                                ← Sebelumnya
                              </Button>
                              <span className="flex items-center px-3 py-2 text-sm font-medium">
                                {jobsPage} / {Math.ceil(jobPostings.length / ITEMS_PER_PAGE)}
                              </span>
                              <Button variant="outline" size="sm" onClick={() => setJobsPage(jobsPage + 1)} disabled={jobsPage >= Math.ceil(jobPostings.length / ITEMS_PER_PAGE)}>
                                Berikutnya →
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Applications Section */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-600">
                        <Check className="h-5 w-5" />
                        Daftar Applications
                      </CardTitle>
                      <CardDescription>Total {applications.length} aplikasi</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isLoadingApps ? (
                        <div className="text-center py-8">
                          <div className="animate-spin inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                          <p className="text-muted-foreground mt-2">Memuat data aplikasi...</p>
                        </div>
                      ) : applications.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Belum ada aplikasi</p>
                          <Button onClick={fetchApplications} className="mt-4" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Muat Data Aplikasi
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-3 px-4 font-bold">Alumni</th>
                                  <th className="text-left py-3 px-4 font-bold">Job Title</th>
                                  <th className="text-left py-3 px-4 font-bold">Status</th>
                                  <th className="text-left py-3 px-4 font-bold">Tanggal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {applications.slice((appsPage - 1) * ITEMS_PER_PAGE, appsPage * ITEMS_PER_PAGE).map((app) => (
                                  <tr key={app.id} className="border-b hover:bg-muted/50 transition">
                                    <td className="py-3 px-4">{app.alumni_name || `Alumni #${app.alumni_id}`}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{app.job_title || `Job #${app.job_posting_id}`}</td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${app.status === "accepted" ? "bg-green-100 text-green-700" : app.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                          }`}
                                      >
                                        {app.status}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(app.created_at).toLocaleDateString("id-ID")}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                              Menampilkan {(appsPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(appsPage * ITEMS_PER_PAGE, applications.length)} dari {applications.length}
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setAppsPage(Math.max(1, appsPage - 1))} disabled={appsPage === 1}>
                                ← Sebelumnya
                              </Button>
                              <span className="flex items-center px-3 py-2 text-sm font-medium">
                                {appsPage} / {Math.ceil(applications.length / ITEMS_PER_PAGE)}
                              </span>
                              <Button variant="outline" size="sm" onClick={() => setAppsPage(appsPage + 1)} disabled={appsPage >= Math.ceil(applications.length / ITEMS_PER_PAGE)}>
                                Berikutnya →
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>



                {/* DATABASE TAB */}
                <TabsContent value="database" className="space-y-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Database Management
                      </CardTitle>
                      <CardDescription>Kelola dan backup database</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Card className="border">
                            <CardHeader>
                              <CardTitle className="text-lg">Database Backup</CardTitle>
                              <CardDescription>Backup semua data</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button onClick={handleBackup} className="w-full gap-2">
                                <Database className="h-4 w-4" />
                                Create Backup
                              </Button>
                            </CardContent>
                          </Card>
                          <Card className="border">
                            <CardHeader>
                              <CardTitle className="text-lg">Restore Database</CardTitle>
                              <CardDescription>Kembalikan dari backup</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button onClick={handleRestore} variant="outline" className="w-full gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Restore Backup
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                        <Card className="border-2 border-red-200">
                          <CardHeader>
                            <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                              <Database className="h-5 w-5" />
                              Danger Zone
                            </CardTitle>
                            <CardDescription>Operasi berbahaya yang tidak bisa di-undo</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50">
                              <div>
                                <h3 className="font-semibold text-red-700">Clear All Cache</h3>
                                <p className="text-sm text-red-600">Hapus semua cache sistem</p>
                              </div>
                              <Button variant="destructive" className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Clear Cache
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50">
                              <div>
                                <h3 className="font-semibold text-red-700">Nuclear Reset</h3>
                                <p className="text-sm text-red-600">Hapus SEMUA data dari database</p>
                              </div>
                              <Button variant="destructive" onClick={handleClearAll} className="gap-2">
                                <Database className="h-4 w-4" />
                                Reset Database
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SETTINGS TAB */}
                <TabsContent value="settings" className="space-y-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Pengaturan System
                      </CardTitle>
                      <CardDescription>Konfigurasi dan pengaturan aplikasi</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">Refresh Data</h3>
                            <p className="text-sm text-muted-foreground">Muat ulang semua data</p>
                          </div>
                          <Button onClick={loadData} disabled={isLoading} className="gap-2">
                            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">Email Notifications</h3>
                            <p className="text-sm text-muted-foreground">Aktifkan notifikasi email</p>
                          </div>
                          <Button variant="outline" className="gap-2">
                            <Check className="h-4 w-4" />
                            Enabled
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">Maintenance Mode</h3>
                            <p className="text-sm text-muted-foreground">Aktifkan mode maintenance untuk sistem</p>
                          </div>
                          <Button onClick={handleMaintenanceToggle} disabled={isTogglingMaintenance} variant={isMaintenanceMode ? "destructive" : "outline"} className="gap-2">
                            {isTogglingMaintenance ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                            {isMaintenanceMode ? "On" : "Off"}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">API Rate Limit</h3>
                            <p className="text-sm text-muted-foreground">1000 requests per hour</p>
                          </div>
                          <Button variant="outline" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Settings
                      </CardTitle>
                      <CardDescription>Pengaturan keamanan sistem</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground">Tambahkan lapisan keamanan ekstra</p>
                          </div>
                          <Button variant="outline" className="gap-2">
                            <Shield className="h-4 w-4" />
                            Enable 2FA
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">Session Timeout</h3>
                            <p className="text-sm text-muted-foreground">Auto logout after 30 minutes</p>
                          </div>
                          <Button variant="outline" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Selected User Detail Modal */}
          {selectedUser && (
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Detail User
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Nama</Label>
                      <div className="font-semibold text-lg">
                        {selectedUser.name}
                        {selectedUser.role === "admin" && selectedUser.email === "superadmin@example.com" && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold">SUPER</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Email</Label>
                      <div className="font-semibold">{selectedUser.email}</div>
                    </div>
                    <div>
                      <Label className="text-sm">Role</Label>
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${selectedUser.role === "admin" && selectedUser.email === "superadmin@example.com"
                          ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 border-2 border-blue-300"
                          : selectedUser.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : selectedUser.role === "alumni"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                      >
                        {selectedUser.role === "admin" && selectedUser.email === "superadmin@example.com" ? "Super Admin" : selectedUser.role === "admin" ? "Admin SMK" : selectedUser.role === "alumni" ? "Alumni" : "Perusahaan"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Dibuat</Label>
                      <div className="font-semibold">
                        {new Date(selectedUser.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  {selectedUser.password && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Label className="text-yellow-800 text-sm">Password (Tampilkan setelah create)</Label>
                      <div className="text-yellow-900 font-mono text-lg mt-1">{selectedUser.password}</div>
                      <p className="text-xs text-yellow-700 mt-2">⚠️ Simpan password ini, tidak akan ditampilkan lagi</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Maintenance Mode Dialog */}
          <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-500" />
                  Aktifkan Maintenance Mode
                </DialogTitle>
                <DialogDescription>Set waktu selesai maintenance dan pesan untuk user</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                  <Input id="endDate" type="date" value={maintenanceEndDate} onChange={(e) => setMaintenanceEndDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Waktu Selesai (24 Jam)</Label>
                  <Input
                    id="endTime"
                    type="text"
                    placeholder="HH:MM (contoh: 15:30)"
                    value={maintenanceEndTime}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Allow only numbers and colon
                      value = value.replace(/[^0-9:]/g, "");
                      // Remove extra colons
                      value = value.replace(/::+/g, ":");
                      // Ensure only one colon at position 2
                      if (value.length > 2) {
                        const parts = value.split(":");
                        if (parts.length > 2) {
                          value = parts[0] + ":" + parts[1];
                        } else if (parts.length === 2 && parts[1].length > 2) {
                          value = parts[0] + ":" + parts[1].slice(0, 2);
                        } else if (parts.length === 1 && value.length > 2) {
                          // Auto-add colon at position 2 if not manually added
                          const firstPart = value.slice(0, 2);
                          const secondPart = value.slice(2);
                          value = firstPart + ":" + secondPart;
                        }
                      }
                      // Limit to HH:MM format
                      if (value.length > 5) {
                        value = value.slice(0, 5);
                      }
                      setMaintenanceEndTime(value);
                    }}
                    maxLength={5}
                  />
                  <p className="text-xs text-muted-foreground">Format: HH:MM (00:00 - 23:59)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Pesan (Opsional)</Label>
                  <Input id="message" placeholder="Contoh: Kami sedang melakukan update sistem..." value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} />
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setShowMaintenanceDialog(false)}>
                    Batal
                  </Button>
                  <Button onClick={toggleMaintenanceMode} disabled={isTogglingMaintenance || !maintenanceEndDate || !maintenanceEndTime} className="bg-orange-500 hover:bg-orange-600">
                    {isTogglingMaintenance ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Mengaktifkan...
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        Aktifkan Maintenance
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default SuperAdminDashboard;
