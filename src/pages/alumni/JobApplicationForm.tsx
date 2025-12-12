import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { API_URL } from "@/config/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, FileText, Send, X, Check } from "lucide-react";

interface JobPosting {
  id: number;
  title: string;
  position: string;
  location: string;
  description: string;
  requirements: string;
  benefits: string;
  job_type: string;
  salary_range: string;
  company: {
    id: number;
    name: string;
    email: string;
  };
}

interface Document {
  id: number;
  title: string;
  file_name: string;
  file_size: number;
  file_type: string;
}

const JobApplicationForm = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [draftMessage, setDraftMessage] = useState("");
  const [step, setStep] = useState<"form" | "preview" | "message">("form");

  // Load job posting and documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch job posting
        console.log("Fetching job posting:", `${API_URL}/job-postings/${jobId}`);
        const jobResponse = await fetch(`${API_URL}/job-postings/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        console.log("Job response status:", jobResponse.status);
        if (!jobResponse.ok) {
          const errorData = await jobResponse.json().catch(() => ({ message: "Unknown error" }));
          console.error("Job fetch error:", errorData);
          throw new Error(errorData.message || "Failed to fetch job posting");
        }
        const jobData = await jobResponse.json();
        console.log("Job data received:", jobData);
        setJobPosting(jobData);

        // Fetch documents
        const docsResponse = await fetch(`${API_URL}/documents`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (docsResponse.ok) {
          const docsData = await docsResponse.json();
          setDocuments(docsData);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({ title: "Error", description: "Gagal memuat data", variant: "destructive" });
        navigate("/alumni/dashboard?tab=jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobId, navigate]);

  const handleCoverLetterChange = (text: string) => {
    if (text.length <= 5000) {
      setCoverLetter(text);
      setCharCount(text.length);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDocumentSelect = (docId: number) => {
    setSelectedDocuments((prev) => {
      if (prev.includes(docId)) {
        return prev.filter((id) => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };

  const generateMessage = () => {
    const selectedDocs = selectedDocuments.length > 0 ? `\n\nDokumen yang dilampirkan:\n- ${selectedDocuments.map((id) => documents.find((d) => d.id === id)?.title).join("\n- ")}` : "";
    const message = `Halo,\n\nSaya ingin melamar untuk posisi ${jobPosting?.position}.\n\n${coverLetter}${selectedDocs}\n\nTerima kasih.`;
    setDraftMessage(message);
    setStep("message");
  };

  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      toast({ title: "Error", description: "Cover letter harus diisi", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      console.log("Job ID:", jobId, "Type:", typeof jobId);

      const response = await fetch(`${API_URL}/applications/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          job_posting_id: parseInt(jobId || "0"),
          cover_letter: coverLetter,
          document_ids: selectedDocuments,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDraftMessage(data.message_text);
        toast({ title: "Sukses", description: "Aplikasi berhasil dikirim!" });
        // Redirect to dashboard jobs tab
        navigate("/alumni/dashboard?tab=jobs", { replace: true });
      } else {
        const errorData = await response.json();
        console.log("API Error Response:", response.status, errorData);
        toast({ title: "Error", description: errorData.message || "Gagal melamar", variant: "destructive" });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({ title: "Error", description: "Gagal melamar", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !jobPosting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button onClick={() => navigate("/alumni/dashboard?tab=jobs")} className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-2">Lamar untuk {jobPosting.position}</h1>
        <p className="text-muted-foreground">
          {jobPosting.company.name} • {jobPosting.location}
        </p>
      </motion.div>

      {step === "form" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Job Details Card */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-bold mb-4">Detail Lowongan</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Posisi</p>
                <p className="font-semibold">{jobPosting.position}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tipe Pekerjaan</p>
                <p className="font-semibold capitalize">{jobPosting.job_type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lokasi</p>
                <p className="font-semibold">{jobPosting.location}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gaji</p>
                <p className="font-semibold">{jobPosting.salary_range || "Tidak disebutkan"}</p>
              </div>
            </div>
          </Card>

          {/* Description Card */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-bold mb-4">Deskripsi Lowongan</h2>
            <div className="space-y-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Tentang Posisi</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{jobPosting.description}</p>
              </div>
              {jobPosting.requirements && (
                <div>
                  <h3 className="font-semibold mb-2">Persyaratan</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{jobPosting.requirements}</p>
                </div>
              )}
              {jobPosting.benefits && (
                <div>
                  <h3 className="font-semibold mb-2">Manfaat</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{jobPosting.benefits}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Cover Letter Form */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-bold mb-4">Surat Lamaran</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="coverLetter">Surat Lamaran *</Label>
                  <span className={`text-xs ${charCount > 4000 ? "text-orange-500" : "text-muted-foreground"}`}>{charCount}/5000</span>
                </div>
                <Textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => handleCoverLetterChange(e.target.value)}
                  placeholder="Ceritakan mengapa Anda tertarik dengan posisi ini dan bagaimana pengalaman Anda relevan..."
                  className="border-2 border-border/50 focus:border-primary/50 min-h-48 text-base bg-white/50 backdrop-blur-sm transition-all duration-300 resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Documents Selection */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-bold mb-4">Dokumen yang Dilampirkan</h2>
            <p className="text-sm text-muted-foreground mb-4">Pilih dokumen yang ingin ditampilkan ke perusahaan</p>

            {documents.length === 0 ? (
              <div className="p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed border-border/50">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground text-sm">Belum ada dokumen. Silakan upload dokumen terlebih dahulu di halaman Dokumen.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition">
                    <Checkbox checked={selectedDocuments.includes(doc.id)} onCheckedChange={() => handleDocumentSelect(doc.id)} id={`doc-${doc.id}`} />
                    <label htmlFor={`doc-${doc.id}`} className="flex-1 cursor-pointer">
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.file_name} • {formatFileSize(doc.file_size)} • {doc.file_type}
                      </p>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/alumni/dashboard?tab=jobs")}>
              Batal
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-primary to-secondary text-white" onClick={generateMessage} disabled={!coverLetter.trim()}>
              Lanjut ke Pesan
            </Button>
          </div>
        </motion.div>
      )}

      {step === "message" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card className="p-6 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                <Check className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">Aplikasi Anda Siap!</p>
                <p className="text-sm text-blue-800 mt-1">Pesan draft telah dibuat. Silakan review dan klik tombol kirim untuk mengirim pesan ke perusahaan.</p>
              </div>
            </div>
          </Card>

          {/* Preview dokumen yang dilampirkan */}
          {selectedDocuments.length > 0 && (
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
              <h2 className="text-lg font-bold mb-4">Dokumen yang Dilampirkan</h2>
              <div className="space-y-2">
                {selectedDocuments.map((docId) => {
                  const doc = documents.find((d) => d.id === docId);
                  return (
                    <div key={docId} className="flex items-center gap-2 p-3 bg-muted/30 rounded">
                      <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{doc?.title}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Message Preview */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <h2 className="text-lg font-bold mb-4">Preview Pesan</h2>
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50 whitespace-pre-wrap text-sm">{draftMessage}</div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali Edit
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-primary to-secondary text-white gap-2" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Simpan & Lanjut ke Chat
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default JobApplicationForm;
