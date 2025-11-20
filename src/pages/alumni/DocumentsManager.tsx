import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Upload, Download, Trash2, File, FileText, Image, Loader2, AlertCircle } from "lucide-react";

interface Document {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: "cv" | "sertifikat" | "portofolio" | "surat_rekomendasi";
  uploadedAt: Date;
  fileUrl?: string;
}

const DocumentsManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      title: "CV 2024",
      fileName: "CV_Ahmad_2024.pdf",
      fileSize: 245000,
      fileType: "cv",
      uploadedAt: new Date("2024-11-15"),
      fileUrl: "#",
    },
    {
      id: "2",
      title: "Sertifikat React",
      fileName: "React_Certificate.pdf",
      fileSize: 512000,
      fileType: "sertifikat",
      uploadedAt: new Date("2024-11-10"),
      fileUrl: "#",
    },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedType, setSelectedType] = useState<"cv" | "sertifikat" | "portofolio" | "surat_rekomendasi">("cv");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const docTypes = [
    { id: "cv", label: "CV", icon: FileText },
    { id: "sertifikat", label: "Sertifikat", icon: File },
    { id: "portofolio", label: "Portofolio", icon: Image },
    { id: "surat_rekomendasi", label: "Surat Rekomendasi", icon: FileText },
  ];

  const getDocIcon = (type: string) => {
    const doc = docTypes.find((d) => d.id === type);
    const Icon = doc?.icon || File;
    return <Icon className="h-8 w-8 text-primary" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedFormats = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];

    if (file.size > maxSize) {
      toast({ title: "Error", description: "Ukuran file maksimal 5MB", variant: "destructive" });
      return;
    }

    if (!allowedFormats.includes(file.type)) {
      toast({ title: "Error", description: "Format file harus PDF, DOC, DOCX, JPG, atau PNG", variant: "destructive" });
      return;
    }

    if (!newTitle.trim()) {
      toast({ title: "Error", description: "Judul dokumen harus diisi", variant: "destructive" });
      return;
    }

    // Simulate upload
    setIsUploading(true);
    setTimeout(() => {
      const newDoc: Document = {
        id: Date.now().toString(),
        title: newTitle,
        fileName: file.name,
        fileSize: file.size,
        fileType: selectedType,
        uploadedAt: new Date(),
      };
      setDocuments([...documents, newDoc]);
      setNewTitle("");
      setIsUploading(false);
      toast({ title: "Sukses", description: "Dokumen berhasil diupload" });
    }, 1500);
  };

  const handleDelete = (id: string) => {
    if (deletingId === id) {
      setDocuments(documents.filter((d) => d.id !== id));
      setDeletingId(null);
      toast({ title: "Sukses", description: "Dokumen berhasil dihapus" });
    } else {
      setDeletingId(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
        <h2 className="text-2xl font-bold mb-6">Unggah Dokumen</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Dokumen</Label>
              <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Contoh: CV Terbaru 2024" className="border-border/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipe Dokumen</Label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as "cv" | "sertifikat" | "portofolio" | "surat_rekomendasi")}
                className="w-full px-3 py-2 border border-border/50 rounded-md bg-background hover:bg-muted transition-colors"
              >
                {docTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors hover:bg-primary/5">
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-sm font-medium mb-1">Drag & drop file Anda di sini</p>
                <p className="text-xs text-muted-foreground mb-4">atau klik tombol di bawah</p>
              </div>
              <label htmlFor="file-upload" className="inline-block">
                <Button asChild disabled={isUploading} className="gap-2 cursor-pointer">
                  <span>
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Pilih File
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <input id="file-upload" type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
              <p className="text-xs text-muted-foreground">Format: PDF, DOC, DOCX, JPG, PNG | Maksimal: 5MB</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Documents List */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
        <h2 className="text-2xl font-bold mb-6">Dokumen Saya</h2>
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">Belum ada dokumen yang diupload</p>
            <p className="text-sm text-gray-400">Mulai dengan mengunggah CV atau dokumen pendukung lainnya</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all duration-200">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">{getDocIcon(doc.fileType)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{doc.title}</h4>
                    <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground mt-1">
                      <span>{doc.fileName}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize flex-shrink-0">
                    {doc.fileType.replace("_", " ")}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="ghost" className="gap-2" title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant={deletingId === doc.id ? "destructive" : "ghost"} onClick={() => handleDelete(doc.id)} className="gap-2" title={deletingId === doc.id ? "Klik lagi untuk confirm" : "Delete"}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Info */}
      <Card className="p-4 bg-blue-500/10 border border-blue-500/50">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-medium text-blue-900">Tips Upload Dokumen</p>
            <ul className="text-blue-800 space-y-1 text-xs">
              <li>• Upload CV untuk meningkatkan peluang dilihat perekrut</li>
              <li>• Tambahkan sertifikat untuk menunjukkan keahlian Anda</li>
              <li>• Sertakan portofolio untuk project terbaik Anda</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentsManager;
