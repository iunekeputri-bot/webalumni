import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Building2, LogOut, Home, Users, Briefcase, MessageCircle, FileText, BarChart3, TrendingUp, Search, Star, Send, Clock, CheckCircle, Eye, Mail, Phone, MapPin, Code, MoreVertical, Plus, X, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { toast } from "@/components/ui/use-toast";

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
}

interface JobPosting {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  salary: string;
  location: string;
  type: "Full Time" | "Part Time" | "Contract";
  applicants: number;
  views: number;
  createdAt: string;
  status: "active" | "closed";
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

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", location: "", salary: "" });

  // Mock Data
  const [alumni, setAlumni] = useState<Alumni[]>([
    {
      id: "1",
      name: "Ahmad Hidayatullah",
      email: "ahmad@email.com",
      phone: "082123456789",
      skills: ["React", "Node.js", "TypeScript", "UI/UX"],
      status: "siap_bekerja",
      profileCompletion: 95,
      avatar: "https://avatar.vercel.sh/ahmad",
      major: "Teknik Informatika",
      graduationYear: 2023,
      bio: "Full Stack Developer dengan pengalaman 2 tahun",
      viewed: true,
      contacted: false,
      liked: true,
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      email: "siti@email.com",
      phone: "081987654321",
      skills: ["UI/UX Design", "Figma", "Adobe XD", "Frontend"],
      status: "mencari_peluang",
      profileCompletion: 88,
      avatar: "https://avatar.vercel.sh/siti",
      major: "Desain Grafis",
      graduationYear: 2023,
      bio: "UX/UI Designer passionate about creating beautiful interfaces",
      viewed: true,
      contacted: true,
      liked: false,
    },
    {
      id: "3",
      name: "Budi Santoso",
      email: "budi@email.com",
      phone: "085123789456",
      skills: ["Python", "Data Analysis", "Machine Learning", "SQL"],
      status: "siap_bekerja",
      profileCompletion: 92,
      avatar: "https://avatar.vercel.sh/budi",
      major: "Data Science",
      graduationYear: 2024,
      bio: "Data Scientist dengan fokus pada analytics dan insights",
      viewed: false,
      contacted: false,
      liked: false,
    },
  ]);

  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: "1",
      title: "Senior Full Stack Developer",
      description: "Kami mencari developer berpengalaman untuk bergabung dengan tim...",
      requirements: ["3+ tahun pengalaman", "React", "Node.js", "MongoDB"],
      salary: "8-12 Juta",
      location: "Jakarta",
      type: "Full Time",
      applicants: 24,
      views: 342,
      createdAt: "2 hari lalu",
      status: "active",
    },
    {
      id: "2",
      title: "UI/UX Designer",
      description: "Bergabunglah dengan tim design kami yang kreatif dan inovatif...",
      requirements: ["1+ tahun pengalaman", "Figma", "UI/UX principles", "Prototyping"],
      salary: "5-8 Juta",
      location: "Bandung",
      type: "Full Time",
      applicants: 18,
      views: 256,
      createdAt: "5 hari lalu",
      status: "active",
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      alumniId: "1",
      alumniName: "Ahmad Hidayatullah",
      lastMessage: "Terima kasih atas penawaran pekerjaan! Saya tertarik sekali.",
      timestamp: "10 menit lalu",
      unread: 1,
      avatar: "https://avatar.vercel.sh/ahmad",
    },
    {
      id: "2",
      alumniId: "2",
      alumniName: "Siti Nurhaliza",
      lastMessage: "Apakah masih membuka lowongan untuk UI/UX Designer?",
      timestamp: "1 jam lalu",
      unread: 0,
      avatar: "https://avatar.vercel.sh/siti",
    },
  ]);

  const statsData = [
    { name: "Jan", alumni: 240, aplikasi: 24 },
    { name: "Feb", alumni: 380, aplikasi: 36 },
    { name: "Mar", alumni: 320, aplikasi: 29 },
    { name: "Apr", alumni: 490, aplikasi: 42 },
    { name: "May", alumni: 550, aplikasi: 48 },
    { name: "Jun", alumni: 720, aplikasi: 64 },
  ];

  const skillsData = [
    { name: "React", value: 240 },
    { name: "Python", value: 180 },
    { name: "Node.js", value: 165 },
    { name: "UI/UX", value: 140 },
    { name: "Data Science", value: 95 },
  ];

  const COLORS = ["#3b82f6", "#ec4899", "#8b5cf6", "#f59e0b", "#10b981"];

  const handleContactAlumni = (alumniId: string) => {
    const alumniName = alumni.find((a) => a.id === alumniId)?.name;
    toast({
      title: "Pesan Terkirim! 📧",
      description: `Pesan telah dikirim ke ${alumniName}`,
    });
    setMessageText("");
  };

  const handlePostJob = () => {
    if (!newJob.title || !newJob.location || !newJob.salary) {
      toast({
        title: "Error",
        description: "Lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Lowongan Berhasil Diposting! 🎉",
      description: `${newJob.title} telah ditambahkan ke database`,
    });
    setNewJob({ title: "", location: "", salary: "" });
    setShowJobForm(false);
  };

  const filteredAlumni = alumni.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

  const handleLogout = () => {
    navigate("/");
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
                <p className="text-lg font-bold">PT. Contoh Perusahaan</p>
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
                {messages.reduce((sum, m) => sum + m.unread, 0) > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">{messages.reduce((sum, m) => sum + m.unread, 0)}</Badge>}
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
                    value: "1,245",
                    desc: "+128 minggu ini",
                    color: "from-blue-500/20 to-cyan-500/20",
                    textColor: "text-blue-600",
                  },
                  {
                    icon: Briefcase,
                    label: "Lowongan Aktif",
                    value: "12",
                    desc: "+3 minggu ini",
                    color: "from-purple-500/20 to-pink-500/20",
                    textColor: "text-purple-600",
                  },
                  {
                    icon: TrendingUp,
                    label: "Total Aplikasi",
                    value: "342",
                    desc: "+24 hari ini",
                    color: "from-orange-500/20 to-red-500/20",
                    textColor: "text-orange-600",
                  },
                  {
                    icon: MessageCircle,
                    label: "Pesan Baru",
                    value: "24",
                    desc: "8 belum dibaca",
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                    <h3 className="text-lg font-bold mb-6">Alumni & Aplikasi (6 Bulan)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={statsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.1} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="alumni" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="aplikasi" fill="#ec4899" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Card className="p-6 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                    <h3 className="text-lg font-bold mb-6">Top Skills Alumni</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={skillsData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                          {skillsData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </motion.div>
              </div>

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
                          onClick={() => setSelectedAlumni(alum)}
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
                            <Badge className={alum.status === "siap_bekerja" ? "bg-green-500/20 text-green-700" : "bg-blue-500/20 text-blue-700"}>{alum.status === "siap_bekerja" ? "✓ Siap Bekerja" : "Mencari Peluang"}</Badge>
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
                            onClick={() => {
                              toast({ title: "Profile dibuka", description: alum.name });
                            }}
                            className="flex-1 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold rounded-lg hover:from-primary/20 hover:to-secondary/20 transition-all gap-2 flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm hidden md:inline">Lihat</span>
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
                        <h3 className="text-xl font-bold">Post Lowongan Baru</h3>
                        <button onClick={() => setShowJobForm(false)} className="p-1 hover:bg-muted rounded-lg transition-colors">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <Input placeholder="Judul Pekerjaan" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="border-2 border-border/50" />
                        <Input placeholder="Lokasi" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} className="border-2 border-border/50" />
                        <Input placeholder="Range Gaji (misal: 5-8 Juta)" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} className="border-2 border-border/50" />
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setShowJobForm(false)} className="flex-1">
                            Batal
                          </Button>
                          <Button onClick={handlePostJob} className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                            Post
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
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </motion.button>
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
                        <Button variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold">Lihat Aplikasi</Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* MESSAGES TAB */}
            <TabsContent value="messages" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 h-[600px]">
                {/* Messages List */}
                <div className="md:col-span-1 space-y-2">
                  {messages.map((msg, i) => (
                    <motion.button
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedAlumni(alumni.find((a) => a.id === msg.alumniId) || null)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${selectedAlumni?.id === msg.alumniId ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={msg.avatar} />
                            <AvatarFallback>{msg.alumniName[0]}</AvatarFallback>
                          </Avatar>
                          {msg.unread > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-xs">{msg.unread}</Badge>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{msg.alumniName}</p>
                          <p className="text-xs text-muted-foreground truncate">{msg.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Chat Area */}
                {selectedAlumni ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 flex flex-col bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl overflow-hidden shadow-lg">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedAlumni.avatar} />
                          <AvatarFallback>{selectedAlumni.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{selectedAlumni.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedAlumni.email}</p>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-muted rounded-lg">
                        <Phone className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedAlumni.avatar} />
                          <AvatarFallback>{selectedAlumni.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="max-w-xs bg-muted rounded-xl p-3">
                          <p className="text-sm">{messages.find((m) => m.alumniId === selectedAlumni.id)?.lastMessage}</p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-border/50">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ketik pesan..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && messageText.trim()) {
                              handleContactAlumni(selectedAlumni.id);
                            }
                          }}
                          className="border-2 border-border/50"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleContactAlumni(selectedAlumni.id)}
                          className="px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <Send className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-2 flex items-center justify-center bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">Pilih percakapan untuk dimulai</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

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
                      <Badge className={selectedAlumni.status === "siap_bekerja" ? "bg-green-500/20 text-green-700" : "bg-blue-500/20 text-blue-700"}>{selectedAlumni.status === "siap_bekerja" ? "✓ Siap Bekerja" : "Mencari Peluang"}</Badge>
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
                  <Button variant="outline" className="flex-1 gap-2">
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
    </div>
  );
};

export default CompanyDashboard;
