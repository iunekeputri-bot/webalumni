import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const { user, login } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        toast({
          title: "Error",
          description: "Email dan password harus diisi",
          variant: "destructive",
        });
        return;
      }

      await login(formData.email, formData.password, "admin");
      toast({
        title: "Selamat datang! 👋",
        description: `Login sebagai ${formData.email}`,
      });
      navigate("/admin/dashboard");
    } catch {
      toast({
        title: "Error",
        description: "Email atau password salah",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Back to Home */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="absolute top-4 left-4 z-10">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          ← Kembali ke Beranda
        </Button>
      </motion.div>

      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl w-full items-center">
          {/* Left Section - Info */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-8 hidden md:block">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Portal Admin SMK
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Kelola Alumni dengan Mudah</h1>
              <p className="text-xl text-muted-foreground">Dashboard admin untuk mengelola data alumni, verifikasi profil, dan monitoring sistem</p>
            </div>

            <div className="space-y-4">
              {["Input & kelola data alumni", "Verifikasi profil alumni", "Monitor aktivitas sistem", "Laporan & analytics"].map((benefit, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-muted-foreground">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Section - Auth Form */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <Card className="p-8 bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    <Shield className="h-4 w-4" />
                    Admin Login
                  </div>
                  <h2 className="text-2xl font-bold">Masuk ke Dashboard</h2>
                  <p className="text-sm text-muted-foreground mt-2">Kelola sistem alumni dengan aman</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="email">Email Admin *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@smk.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 border-2 border-border/50 focus:border-primary/50 h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10 border-2 border-border/50 focus:border-primary/50 h-11"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" checked={formData.rememberMe} onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })} />
                    <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Ingat saya
                    </label>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Masuk
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-xs text-muted-foreground">Hubungi kepala sekolah untuk mendapatkan akses admin</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
