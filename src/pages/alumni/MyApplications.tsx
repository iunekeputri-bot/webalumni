import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { FileText, Trash2, Eye, MessageCircle, Loader2, AlertCircle, Calendar } from "lucide-react";
import { API_URL } from "@/config/api";

interface JobApplication {
  id: number;
  job_posting_id: number;
  status: "pending" | "viewed" | "accepted" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  cover_letter: string;
  jobPosting?: {
    id: number;
    title: string;
    position: string;
    location: string;
    deleted_at?: string;
    company: {
      id: number;
      name: string;
    };
  };
  job_posting?: {
    id: number;
    title: string;
    position: string;
    location: string;
    deleted_at?: string;
    company: {
      id: number;
      name: string;
    };
  };
  documents: Array<{
    id: number;
    title: string;
  }>;
}

const MyApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedTab, setSelectedTab] = useState<"all" | "pending" | "viewed" | "accepted" | "rejected">("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
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
        console.log("Raw API Response:", data);

        // Normalize snake_case to camelCase
        const normalizedData = data.map((app: any) => ({
          ...app,
          jobPosting: app.job_posting || app.jobPosting,
        }));

        console.log("Normalized Data:", normalizedData);
        setApplications(normalizedData);
      } else {
        toast({ title: "Error", description: "Gagal memuat aplikasi", variant: "destructive" });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({ title: "Error", description: "Gagal memuat aplikasi", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId: number) => {
    if (deletingId === applicationId) {
      try {
        const token = localStorage.getItem("token");
        const xsrf = typeof document !== "undefined" ? document.cookie.split("; ").find((c) => c.startsWith("XSRF-TOKEN="))?.split("=")[1] : undefined;
        const xsrfToken = xsrf ? decodeURIComponent(xsrf) : "";
        const response = await fetch(`${API_URL}/applications/${applicationId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-XSRF-TOKEN": xsrfToken,
          },
          credentials: "include",
        });

        if (response.ok) {
          setApplications(applications.filter((app) => app.id !== applicationId));
          setDeletingId(null);
          toast({ title: "Sukses", description: "Aplikasi berhasil dihapus" });
        } else {
          toast({ title: "Error", description: "Gagal menghapus aplikasi", variant: "destructive" });
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast({ title: "Error", description: "Gagal menghapus aplikasi", variant: "destructive" });
      }
    } else {
      setDeletingId(applicationId);
    }
  };

  const handleViewMessages = (applicationId: number) => {
    navigate(`/alumni/applications/${applicationId}/messages`);
  };

  const filteredApplications = selectedTab === "all" ? applications : applications.filter((app) => app.status === selectedTab);

  const statusConfig = {
    pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
    viewed: { label: "Dilihat", color: "bg-blue-100 text-blue-800" },
    accepted: { label: "Diterima", color: "bg-green-100 text-green-800" },
    rejected: { label: "Ditolak", color: "bg-red-100 text-red-800" },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Silakan Login Terlebih Dahulu</h2>
          <Button onClick={() => navigate("/auth")} className="w-full">
            Ke Halaman Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Aplikasi Saya</h1>
        <p className="text-muted-foreground">Kelola dan pantau aplikasi lamaran kerja Anda</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(["all", "pending", "viewed", "accepted", "rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${selectedTab === tab ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {tab === "all" ? "Semua" : tab === "pending" ? "Menunggu" : tab === "viewed" ? "Dilihat" : tab === "accepted" ? "Diterima" : "Ditolak"}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Belum Ada Aplikasi</h3>
          <p className="text-muted-foreground mb-6">Mulai dengan melamar lowongan kerja yang sesuai dengan kemampuan Anda.</p>
          <Button onClick={() => navigate("/alumni/jobs")} className="bg-gradient-to-r from-primary to-secondary text-white">
            Cari Lowongan
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app, idx) => (
            <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">
                          {app.jobPosting?.title || "Lowongan Tidak Tersedia"}
                          {app.jobPosting?.deleted_at && <span className="text-xs text-red-500 ml-2 font-normal">(Dihapus)</span>}
                        </h3>
                        <p className="text-sm text-primary font-medium">{app.jobPosting?.company?.name || "Perusahaan Tidak Diketahui"}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3" />
                          <span>Dilamar: {formatDate(app.created_at)}</span>
                        </div>

                        {/* Documents */}
                        {app.documents && app.documents.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {app.documents.map((doc) => (
                              <Badge key={doc.id} variant="outline" className="text-xs">
                                {doc.title}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    <Badge className={`capitalize ${statusConfig[app.status].color}`}>{statusConfig[app.status].label}</Badge>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewMessages(app.id)} title="Lihat Pesan">
                        <MessageCircle className="h-4 w-4" />
                      </Button>

                      <Button size="sm" variant="ghost" onClick={() => navigate(`/alumni/applications/${app.id}`)} title="Lihat Detail">
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button size="sm" variant={deletingId === app.id ? "destructive" : "ghost"} onClick={() => handleDeleteApplication(app.id)} title={deletingId === app.id ? "Klik lagi untuk confirm" : "Hapus"}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Cover Letter Preview */}
                <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground line-clamp-2">{app.cover_letter}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
