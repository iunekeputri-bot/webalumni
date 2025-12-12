import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { MapPin, DollarSign, Clock, Briefcase, Search, Loader2, AlertCircle, Building2, Mail, Phone } from "lucide-react";
import { API_URL } from "@/config/api";

interface JobPosting {
  id: number;
  title: string;
  position: string;
  location: string;
  description: string;
  job_type: string;
  salary_range: string;
  company: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    description?: string;
    website?: string;
  };
  created_at: string;
  _count?: {
    applications: number;
  };
}

const JobListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterJobType, setFilterJobType] = useState("");

  useEffect(() => {
    fetchAppliedJobs();
    fetchJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/applications/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const applications = await response.json();
        const jobIds = new Set(applications.map((app: any) => app.job_posting_id));
        setAppliedJobIds(jobIds);
      }
    } catch (error) {
      console.error("Failed to fetch applied jobs:", error);
    }
  };

  const fetchJobs = async (search = "", location = "", jobType = "") => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (location) params.append("location", location);
      if (jobType) params.append("job_type", jobType);

      const response = await fetch(`${API_URL}/job-postings?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobPostings(data.data || data);
      } else {
        toast({ title: "Error", description: "Gagal memuat lowongan", variant: "destructive" });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({ title: "Error", description: "Gagal memuat lowongan", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(searchQuery, filterLocation, filterJobType);
  };

  const handleApply = (jobId: number) => {
    navigate(`/alumni/jobs/${jobId}/apply`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const jobTypeColors: Record<string, string> = {
    "full-time": "bg-green-100 text-green-800",
    "part-time": "bg-blue-100 text-blue-800",
    contract: "bg-purple-100 text-purple-800",
    internship: "bg-orange-100 text-orange-800",
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Silakan Login Terlebih Dahulu</h2>
          <p className="text-muted-foreground mb-4">Anda perlu login untuk melihat lowongan kerja dan melamar.</p>
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
        <h1 className="text-4xl font-bold mb-2">Cari Lowongan Kerja</h1>
        <p className="text-muted-foreground">Temukan peluang karir terbaik sesuai dengan kemampuan Anda</p>
      </motion.div>

      {/* Search & Filter Section */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Cari Posisi atau Perusahaan</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari lowongan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 border-2 border-border/50" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Lokasi</label>
              <Input placeholder="Cari lokasi..." value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="border-2 border-border/50" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tipe Pekerjaan</label>
              <select value={filterJobType} onChange={(e) => setFilterJobType(e.target.value)} className="w-full px-3 py-2 border-2 border-border/50 rounded-md bg-background">
                <option value="">Semua Tipe</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Kontrak</option>
                <option value="internship">Magang</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white">
            Cari Lowongan
          </Button>
        </form>
      </Card>

      {/* Job Listings */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : jobPostings.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Tidak Ada Lowongan yang Ditemukan</h3>
          <p className="text-muted-foreground">Coba ubah filter pencarian Anda atau periksa kembali nanti.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobPostings.map((job, idx) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="h-full p-6 bg-white/60 backdrop-blur-sm border-border/50 hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold line-clamp-2">{job.title}</h3>
                      <p className="text-sm text-primary font-medium">{job.company?.name || "Company"}</p>
                    </div>
                  </div>

                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${jobTypeColors[job.job_type] || "bg-gray-100 text-gray-800"}`}>
                    {job.job_type === "full-time" ? "Full Time" : job.job_type === "part-time" ? "Part Time" : job.job_type === "contract" ? "Kontrak" : "Magang"}
                  </div>
                </div>

                {/* Company Info */}
                {job.company && (
                  <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/30">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span>Info Perusahaan</span>
                    </div>

                    {job.company.email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{job.company.email}</span>
                      </div>
                    )}

                    {job.company.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Phone className="h-3 w-3" />
                        <span>{job.company.phone}</span>
                      </div>
                    )}

                    {job.company.address && (
                      <div className="flex items-start gap-2 text-xs text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{job.company.address}</span>
                      </div>
                    )}

                    {job.company.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">{job.company.description}</p>}
                  </div>
                )}

                {/* Job Details */}
                <div className="space-y-3 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.position}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>

                  {job.salary_range && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Diposting: {formatDate(job.created_at)}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{job.description}</p>

                {/* Action */}
                {appliedJobIds.has(job.id) ? (
                  <Button disabled className="w-full bg-gray-400 cursor-not-allowed">
                    Sudah Melamar
                  </Button>
                ) : (
                  <Button onClick={() => handleApply(job.id)} className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                    Lamar Sekarang
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
