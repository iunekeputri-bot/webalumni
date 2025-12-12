import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Upload, X, Loader2, Check, User, Mail, Phone, GraduationCap, FileText, Zap, Heart } from "lucide-react";
import { API_URL } from "@/config/api";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  graduationYear: number;
  major: string;
  bio: string;
  skills: string[];
  workStatus: "siap_bekerja" | "mencari_peluang" | "melanjutkan_pendidikan" | "belum_siap";
  avatar?: string;
}

const ProfileForm = ({ initialData }: { initialData?: ProfileData }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(
    initialData || {
      fullName: "",
      email: "",
      phone: "",
      graduationYear: new Date().getFullYear(),
      major: "",
      bio: "",
      skills: [],
      workStatus: "siap_bekerja",
      avatar: "https://avatar.vercel.sh/alumni",
    }
  );
  const [newSkill, setNewSkill] = useState("");
  const [bioChars, setBioChars] = useState(formData.bio.length);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check localStorage first for profile data
        if (user?.id) {
          const storageKey = `profile_${user.id}`;
          const stored = localStorage.getItem(storageKey);
          if (stored) {
            try {
              const storedData = JSON.parse(stored);
              setFormData(storedData);
              setBioChars(storedData.bio?.length || 0);
              return;
            } catch (error) {
              console.error("Failed to parse stored profile:", error);
            }
          }
        }

        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/alumni/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            fullName: data.name,
            email: data.email,
            phone: data.phone || "",
            graduationYear: data.graduation_year,
            major: data.major,
            bio: data.bio || "",
            skills: data.skills || [],
            workStatus: data.work_status || "siap_bekerja",
            avatar: data.avatar || "https://avatar.vercel.sh/alumni",
          });
          setBioChars((data.bio || "").length);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const workStatusOptions = [
    { id: "siap_bekerja", label: "Siap Bekerja", color: "from-green-500/20 to-emerald-500/20" },
    { id: "mencari_peluang", label: "Mencari Peluang", color: "from-blue-500/20 to-cyan-500/20" },
    { id: "melanjutkan_pendidikan", label: "Melanjutkan Pendidikan", color: "from-purple-500/20 to-pink-500/20" },
    { id: "belum_siap", label: "Belum Siap", color: "from-orange-500/20 to-red-500/20" },
  ];

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "File size maksimal 2MB", variant: "destructive" });
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)) {
      toast({ title: "Error", description: "Format harus JPG, PNG, atau GIF", variant: "destructive" });
      return;
    }

    try {
      // Upload to server
      const uploadData = new FormData();
      uploadData.append("avatar", file);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/alumni/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();

      // Update avatar in state with server URL
      setFormData((prev) => ({ ...prev, avatar: data.avatar }));

      toast({
        title: "Sukses",
        description: "Foto profil berhasil diupload dan dapat dilihat semua orang",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal upload foto profil",
        variant: "destructive",
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setFormData({ ...formData, bio: text });
      setBioChars(text.length);
    }
  };

  const handleSave = async () => {
    if (!formData.fullName.trim() || !formData.major.trim()) {
      toast({ title: "Error", description: "Nama lengkap dan jurusan harus diisi", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      // Save to localStorage with user ID
      if (user?.id) {
        const storageKey = `profile_${user.id}`;
        localStorage.setItem(storageKey, JSON.stringify(formData));
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/alumni/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          phone: formData.phone,
          graduation_year: formData.graduationYear,
          major: formData.major,
          bio: formData.bio,
          skills: formData.skills,
          work_status: formData.workStatus,
          avatar: formData.avatar,
        }),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast({ title: "Sukses", description: "Profil berhasil disimpan" });
    } catch {
      toast({ title: "Error", description: "Gagal menyimpan profil", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Foto Profil */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />
          <div className="relative space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Foto Profil</h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl relative">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-secondary text-white">{formData.fullName?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-full cursor-pointer hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <Upload className="h-5 w-5" />
                  <input id="avatar-upload" type="file" accept="image/jpeg,image/png" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </motion.div>

              <div className="space-y-4 flex-1">
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200/50 rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">Format & Ukuran</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Format: JPG, PNG</li>
                    <li>✓ Ukuran maksimal: 2MB</li>
                    <li>✓ Foto akan ditampilkan di profil publik</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500 italic">Klik icon untuk mengubah foto profil Anda</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Section 2: Data Diri */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />
          <div className="relative space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Data Diri</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2">
                <Label htmlFor="fullname" className="text-base font-semibold mb-2 block">
                  Nama Lengkap *
                </Label>
                <Input
                  id="fullname"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Masukkan nama lengkap Anda"
                  className="border-2 border-border/50 focus:border-primary/50 h-11 text-base bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                <Label htmlFor="email" className="text-base font-semibold mb-2 block flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email (Read-only)
                </Label>
                <Input id="email" value={formData.email} disabled className="bg-muted/50 border-2 border-border/50 h-11 text-base backdrop-blur-sm" />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Label htmlFor="phone" className="text-base font-semibold mb-2 block flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="62812345678"
                  className="border-2 border-border/50 focus:border-primary/50 h-11 text-base bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                <Label htmlFor="graduation" className="text-base font-semibold mb-2 block">
                  Tahun Lulus
                </Label>
                <select
                  id="graduation"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border-2 border-border/50 focus:border-primary/50 rounded-md bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 font-medium"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="md:col-span-2">
                <Label htmlFor="major" className="text-base font-semibold mb-2 block flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> Jurusan/Program *
                </Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  placeholder="Teknik Informatika"
                  className="border-2 border-border/50 focus:border-primary/50 h-11 text-base bg-white/50 backdrop-blur-sm transition-all duration-300"
                />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Section 3: Tentang Saya */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />
          <div className="relative space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Tentang Saya</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio" className="text-base font-semibold">
                  Bio / Deskripsi Diri
                </Label>
                <motion.span animate={{ scale: bioChars > 400 ? 1.1 : 1 }} className={`text-xs font-semibold transition-colors ${bioChars > 400 ? "text-orange-500" : "text-muted-foreground"}`}>
                  {bioChars}/500
                </motion.span>
              </div>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={handleBioChange}
                placeholder="Ceritakan tentang diri Anda, pengalaman, dan tujuan karir Anda..."
                className="border-2 border-border/50 focus:border-primary/50 min-h-40 text-base bg-white/50 backdrop-blur-sm transition-all duration-300 resize-none"
              />
              <Progress value={(bioChars / 500) * 100} className="h-2" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Section 4: Keahlian */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />
          <div className="relative space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Keahlian</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Tambahkan keahlian (React, UI/UX, Backend, dsb...)"
                  className="border-2 border-border/50 focus:border-primary/50 h-11 text-base bg-white/50 backdrop-blur-sm transition-all duration-300"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addSkill}
                  className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  +
                </motion.button>
              </div>

              <div className="space-y-3">
                {formData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {formData.skills.map((skill, idx) => (
                      <motion.div key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: idx * 0.05 }}>
                        <Badge
                          className="gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 border border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-lg text-base font-semibold"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill}
                          <X className="h-4 w-4 hover:scale-125 transition-transform" />
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-border/50">
                    <p className="text-muted-foreground font-medium">Belum ada keahlian yang ditambahkan</p>
                    <p className="text-sm text-gray-400">Tambahkan minimal 3 keahlian untuk profil yang lebih menarik</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Section 5: Status Kesiapan Kerja */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-300 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pointer-events-none" />
          <div className="relative space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Status Kesiapan Kerja</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {workStatusOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, workStatus: option.id as "siap_bekerja" | "mencari_peluang" | "melanjutkan_pendidikan" | "belum_siap" })}
                  className={`p-6 rounded-xl border-2 font-semibold transition-all duration-300 ${
                    formData.workStatus === option.id ? `border-primary bg-gradient-to-br ${option.color} shadow-lg scale-105` : `border-border/50 hover:border-primary/50 hover:bg-muted/50`
                  }`}
                >
                  <div className="flex items-center gap-3 justify-center h-full">
                    <motion.div
                      animate={{
                        scale: formData.workStatus === option.id ? 1 : 0,
                        rotate: formData.workStatus === option.id ? 0 : -180,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="h-5 w-5 text-primary" />
                    </motion.div>
                    <span className="text-base">{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Save Buttons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="flex gap-4 pt-6">
        <Button variant="outline" className="flex-1 h-12 text-base font-semibold border-2 hover:bg-muted transition-all duration-300">
          Batal
        </Button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Check className="h-5 w-5" />
              Simpan Profil
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ProfileForm;
