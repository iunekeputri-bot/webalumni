import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { API_URL } from "@/config/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Calendar, MapPin, Building, FileText, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface Document {
  id: number;
  title: string;
  file_name: string;
}

interface JobApplication {
  id: number;
  status: "pending" | "viewed" | "accepted" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
  cover_letter: string;
  jobPosting: {
    id: number;
    title: string;
    position: string;
    location: string;
    description: string;
    requirements: string | string[];
    job_type: string;
    salary_range: string;
    deleted_at?: string;
    company: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      address?: string;
      website?: string;
    };
  } | null;
  documents: Document[];
}

const ApplicationDetails = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState<JobApplication | null>(null);

  useEffect(() => {
    fetchApplicationDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/applications/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Raw Application Details:", data);

        // Normalize snake_case to camelCase
        const normalizedData = {
          ...data,
          jobPosting: data.job_posting || data.jobPosting,
        };

        console.log("Normalized Application:", normalizedData);
        setApplication(normalizedData);
      } else {
        toast({ title: "Error", description: "Gagal memuat detail aplikasi", variant: "destructive" });
        navigate("/alumni/applications");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({ title: "Error", description: "Gagal memuat detail aplikasi", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusConfig = {
    pending: { label: "Menunggu Review", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    viewed: { label: "Dilihat Perusahaan", color: "bg-blue-100 text-blue-800", icon: EyeIcon },
    accepted: { label: "Diterima", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
    rejected: { label: "Ditolak", color: "bg-red-100 text-red-800", icon: XCircle },
  };

  // Helper for status icon
  function EyeIcon(props: React.ComponentProps<typeof Clock>) {
    return <Clock {...props} />; // Fallback or import Eye
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!application) return null;

  const StatusIcon = statusConfig[application.status].icon;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/alumni/applications")} className="gap-2 mb-4 pl-0 hover:bg-transparent hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Aplikasi
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {application.jobPosting?.title || "Lowongan Tidak Tersedia"}
              {application.jobPosting?.deleted_at && <span className="text-lg text-red-500 ml-3 font-normal">(Lowongan Dihapus)</span>}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{application.jobPosting?.company?.name || "Perusahaan Tidak Diketahui"}</span>
              </div>
              {application.jobPosting && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{application.jobPosting.location}</span>
                </div>
              )}
              {application.jobPosting?.company?.website && (
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <a href={application.jobPosting.company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Website
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Dilamar: {formatDate(application.created_at)}</span>
              </div>
            </div>
          </div>

          <Badge className={`px-4 py-2 text-sm flex items-center gap-2 ${statusConfig[application.status].color}`}>
            <StatusIcon className="h-4 w-4" />
            {statusConfig[application.status].label}
          </Badge>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Job Details */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Detail Lowongan
            </h3>
            <div className="space-y-4 text-sm">
              {application.jobPosting ? (
                <>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Deskripsi</p>
                    <p className="whitespace-pre-wrap leading-relaxed">{application.jobPosting.description}</p>
                  </div>
                  {application.jobPosting.requirements && (
                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Persyaratan</p>
                      <ul className="list-disc list-inside space-y-1">
                        {Array.isArray(application.jobPosting.requirements) ? (
                          application.jobPosting.requirements.map((req: string, i: number) => <li key={i}>{req}</li>)
                        ) : (
                          <p className="whitespace-pre-wrap">{application.jobPosting.requirements}</p>
                        )}
                      </ul>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                    <div>
                      <p className="font-medium text-muted-foreground">Tipe Pekerjaan</p>
                      <p className="capitalize">
                        {application.jobPosting.job_type === "full-time"
                          ? "Full Time"
                          : application.jobPosting.job_type === "part-time"
                            ? "Part Time"
                            : application.jobPosting.job_type === "contract"
                              ? "Kontrak"
                              : application.jobPosting.job_type === "internship"
                                ? "Magang"
                                : application.jobPosting.job_type}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Gaji</p>
                      <p>{application.jobPosting.salary_range || "Tidak disebutkan"}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground italic">Informasi lowongan tidak tersedia.</p>
              )}

              {/* Company Info Section */}
              {application.jobPosting?.company && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" />
                    Info Perusahaan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Nama Perusahaan</p>
                      <p className="font-medium">{application.jobPosting.company.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Email</p>
                      <p className="font-medium">{application.jobPosting.company.email}</p>
                    </div>
                    {application.jobPosting.company.phone && (
                      <div>
                        <p className="text-muted-foreground text-xs">Telepon</p>
                        <p className="font-medium">{application.jobPosting.company.phone}</p>
                      </div>
                    )}
                    {application.jobPosting.company.website && (
                      <div>
                        <p className="text-muted-foreground text-xs">Website</p>
                        <a href={application.jobPosting.company.website} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">{application.jobPosting.company.website}</a>
                      </div>
                    )}
                    {application.jobPosting.company.address && (
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground text-xs">Alamat</p>
                        <p className="font-medium">{application.jobPosting.company.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Cover Letter */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Surat Lamaran
            </h3>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{application.cover_letter}</div>
          </Card>

          {/* Review Notes (if any) */}
          {application.review_notes && (
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Catatan dari Perusahaan
              </h3>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{application.review_notes}</div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4">Dokumen Terlampir</h3>
            {application.documents.length > 0 ? (
              <div className="space-y-3">
                {application.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <FileText className="h-8 w-8 text-primary/50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{doc.file_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Tidak ada dokumen dilampirkan</p>
            )}
          </Card>

          {/* Timeline */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                <p className="text-sm font-medium">Lamaran Dikirim</p>
                <p className="text-xs text-muted-foreground">{formatDate(application.created_at)}</p>
              </div>

              {application.reviewed_at && (
                <div className="relative pl-6">
                  <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-background ${application.status === "rejected" ? "bg-red-500" : "bg-green-500"}`} />
                  <p className="text-sm font-medium">{application.status === "viewed" ? "Dilihat" : application.status === "accepted" ? "Diterima" : application.status === "rejected" ? "Ditolak" : "Direview"}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(application.reviewed_at)}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
