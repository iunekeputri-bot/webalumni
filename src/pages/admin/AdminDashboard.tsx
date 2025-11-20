import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Users, LogOut, Plus, Trash2, Search, Edit2, Eye, Check, AlertCircle } from "lucide-react";

interface Alumni {
  id: string;
  name: string;
  email: string;
  phone: string;
  major: string;
  graduationYear: number;
  status: "active" | "inactive" | "pending";
  joinDate: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  major: string;
  graduationYear: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overview" | "input" | "list">("overview");
  const [alumni, setAlumni] = useState<Alumni[]>([
    {
      id: "1",
      name: "Budi Santoso",
      email: "budi@example.com",
      phone: "082123456789",
      major: "Teknik Informatika",
      graduationYear: 2020,
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      email: "siti@example.com",
      phone: "082987654321",
      major: "Sistem Informasi",
      graduationYear: 2021,
      status: "active",
      joinDate: "2024-02-20",
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    major: "",
    graduationYear: new Date().getFullYear().toString(),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, major: value }));
  };

  const handleYearChange = (value: string) => {
    setFormData((prev) => ({ ...prev, graduationYear: value }));
  };

  const handleAddAlumni = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.major) {
      return;
    }

    const newAlumni: Alumni = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      major: formData.major,
      graduationYear: parseInt(formData.graduationYear),
      status: "pending",
      joinDate: new Date().toISOString().split("T")[0],
    };

    if (editingId) {
      setAlumni((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...newAlumni } : a)));
      setEditingId(null);
    } else {
      setAlumni((prev) => [newAlumni, ...prev]);
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      major: "",
      graduationYear: new Date().getFullYear().toString(),
    });
  };

  const handleDeleteAlumni = (id: string) => {
    setAlumni((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
  };

  const handleEditAlumni = (alumnus: Alumni) => {
    setFormData({
      name: alumnus.name,
      email: alumnus.email,
      phone: alumnus.phone,
      major: alumnus.major,
      graduationYear: alumnus.graduationYear.toString(),
    });
    setEditingId(alumnus.id);
    setTab("input");
  };

  const filteredAlumni = alumni.filter((a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const stats = {
    total: alumni.length,
    active: alumni.filter((a) => a.status === "active").length,
    pending: alumni.filter((a) => a.status === "pending").length,
    inactive: alumni.filter((a) => a.status === "inactive").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </motion.div>
          <Button onClick={handleLogout} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            {
              label: "Total Alumni",
              value: stats.total,
              color: "from-blue-500 to-blue-600",
              icon: Users,
            },
            {
              label: "Active",
              value: stats.active,
              color: "from-green-500 to-green-600",
              icon: Check,
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "from-yellow-500 to-yellow-600",
              icon: AlertCircle,
            },
            {
              label: "Inactive",
              value: stats.inactive,
              color: "from-red-500 to-red-600",
              icon: AlertCircle,
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} whileHover={{ y: -5 }} className={`rounded-xl bg-gradient-to-br ${stat.color} p-6 text-white shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="opacity-90">{stat.label}</p>
                    <p className="text-4xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="h-12 w-12 opacity-20" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 flex gap-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "input", label: "Input Alumni" },
            { id: "list", label: "List Alumni" },
          ].map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => {
                setTab(tabItem.id as "overview" | "input" | "list");
                if (tabItem.id !== "input") {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    major: "",
                    graduationYear: new Date().getFullYear().toString(),
                  });
                }
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${tab === tabItem.id ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}
            >
              {tabItem.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Card className="border-slate-700 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">Statistik Alumni</CardTitle>
                  <CardDescription>Ringkasan data alumni yang terdaftar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Alumni */}
                    <div className="rounded-lg border border-slate-700 p-4">
                      <h3 className="mb-4 font-semibold text-white">Alumni Terbaru</h3>
                      <div className="space-y-3">
                        {alumni.slice(0, 5).map((a) => (
                          <div key={a.id} className="flex items-center justify-between border-b border-slate-700 pb-3 last:border-0">
                            <div>
                              <p className="font-medium text-white">{a.name}</p>
                              <p className="text-sm text-slate-400">{a.email}</p>
                            </div>
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                a.status === "active" ? "bg-green-500/20 text-green-400" : a.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {a.status === "active" ? "Aktif" : a.status === "pending" ? "Pending" : "Nonaktif"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Distribution by Major */}
                    <div className="rounded-lg border border-slate-700 p-4">
                      <h3 className="mb-4 font-semibold text-white">Distribusi Program</h3>
                      <div className="space-y-3">
                        {Array.from(new Set(alumni.map((a) => a.major))).map((major) => {
                          const count = alumni.filter((a) => a.major === major).length;
                          const percentage = (count / alumni.length) * 100;
                          return (
                            <div key={major}>
                              <div className="mb-1 flex justify-between text-sm">
                                <span className="text-slate-300">{major}</span>
                                <span className="font-semibold text-white">{count}</span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-700">
                                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {tab === "input" && (
            <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Card className="border-slate-700 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">{editingId ? "Edit Alumni" : "Input Alumni Baru"}</CardTitle>
                  <CardDescription>{editingId ? "Ubah data alumni" : "Tambahkan alumni baru ke dalam sistem"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-300">
                          Nama Lengkap
                        </Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama" className="border-slate-600 bg-slate-800 text-white placeholder-slate-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">
                          Email
                        </Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email" className="border-slate-600 bg-slate-800 text-white placeholder-slate-500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-300">
                          Nomor Telepon
                        </Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Masukkan nomor telepon" className="border-slate-600 bg-slate-800 text-white placeholder-slate-500" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Program Studi</Label>
                        <Select value={formData.major} onValueChange={handleSelectChange}>
                          <SelectTrigger className="border-slate-600 bg-slate-800 text-white">
                            <SelectValue placeholder="Pilih program studi" />
                          </SelectTrigger>
                          <SelectContent className="border-slate-600 bg-slate-800 text-white">
                            <SelectItem value="Teknik Informatika">Teknik Informatika</SelectItem>
                            <SelectItem value="Sistem Informasi">Sistem Informasi</SelectItem>
                            <SelectItem value="Teknik Komputer">Teknik Komputer</SelectItem>
                            <SelectItem value="Desain Grafis">Desain Grafis</SelectItem>
                            <SelectItem value="Multimedia">Multimedia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Tahun Lulus</Label>
                        <Select value={formData.graduationYear} onValueChange={handleYearChange}>
                          <SelectTrigger className="border-slate-600 bg-slate-800 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-slate-600 bg-slate-800 text-white">
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

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddAlumni} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <Plus className="mr-2 h-4 w-4" />
                        {editingId ? "Update Alumni" : "Tambah Alumni"}
                      </Button>
                      {editingId && (
                        <Button
                          onClick={() => {
                            setEditingId(null);
                            setFormData({
                              name: "",
                              email: "",
                              phone: "",
                              major: "",
                              graduationYear: new Date().getFullYear().toString(),
                            });
                          }}
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-800"
                        >
                          Batal
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {tab === "list" && (
            <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Card className="border-slate-700 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">Daftar Alumni</CardTitle>
                  <CardDescription>Kelola data alumni yang terdaftar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <Search className="h-5 w-5 text-slate-400" />
                    <Input placeholder="Cari nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-slate-600 bg-slate-800 text-white placeholder-slate-500" />
                  </div>

                  <div className="space-y-2">
                    {filteredAlumni.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">Tidak ada alumni ditemukan</div>
                    ) : (
                      filteredAlumni.map((a, i) => (
                        <motion.div
                          key={a.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-white">{a.name}</p>
                            <p className="text-sm text-slate-400">{a.email}</p>
                            <div className="mt-2 flex gap-2 text-xs text-slate-500">
                              <span>{a.major}</span>
                              <span>•</span>
                              <span>{a.graduationYear}</span>
                              <span>•</span>
                              <span>{a.phone}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                a.status === "active" ? "bg-green-500/20 text-green-400" : a.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {a.status === "active" ? "Aktif" : a.status === "pending" ? "Pending" : "Nonaktif"}
                            </span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="border-slate-700 bg-slate-900">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Detail Alumni</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm text-slate-400">Nama</p>
                                    <p className="font-semibold text-white">{a.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-400">Email</p>
                                    <p className="font-semibold text-white">{a.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-400">Telepon</p>
                                    <p className="font-semibold text-white">{a.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-400">Program Studi</p>
                                    <p className="font-semibold text-white">{a.major}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-400">Tahun Lulus</p>
                                    <p className="font-semibold text-white">{a.graduationYear}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-400">Status</p>
                                    <p className="font-semibold text-white capitalize">{a.status === "active" ? "Aktif" : a.status === "pending" ? "Pending" : "Nonaktif"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-400">Tanggal Bergabung</p>
                                    <p className="font-semibold text-white">{new Date(a.joinDate).toLocaleDateString("id-ID")}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button onClick={() => handleEditAlumni(a)} variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <DialogTrigger asChild>
                                <Button onClick={() => setDeleteId(a.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <AlertDialogContent className="border-slate-700 bg-slate-900">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">Hapus Alumni</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus <span className="font-semibold text-white">{a.name}</span>? Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex gap-3">
                                  <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-800">Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteAlumni(a.id)} className="bg-red-600 text-white hover:bg-red-700">
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
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
