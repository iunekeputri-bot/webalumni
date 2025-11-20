import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Building2, ArrowLeft, Users, CheckCircle, Lock, Eye, EyeOff } from "lucide-react";

const CompanyAuth: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/company/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!loginForm.email || !loginForm.password) {
        toast({
          title: "Error",
          description: "Email dan password harus diisi",
          variant: "destructive",
        });
        return;
      }

      await login(loginForm.email, loginForm.password, "company");
      toast({
        title: "Sukses",
        description: "Anda berhasil login",
      });
      navigate("/company/dashboard");
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
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Button>
      </motion.div>

      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl w-full items-center">
          {/* Left Section - Info */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-8 hidden md:block">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                Portal Perusahaan
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Temukan Talenta Terbaik</h1>
              <p className="text-xl text-muted-foreground">Akses database alumni berkualitas, kelola lowongan kerja, dan bangun jaringan profesional bersama komunitas</p>
            </div>

            <div className="space-y-4">
              {["Akses profil alumni lengkap", "Posting lowongan kerja dengan mudah", "Terhubung dengan talenta potensial", "Kelola proses rekrutmen secara efisien"].map((benefit, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
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
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Masuk ke Akun Perusahaan</h2>
                  <p className="text-sm text-muted-foreground">Silakan masuk dengan email dan password Anda</p>
                </div>

                {/* Login Form */}
                <motion.form onSubmit={handleLogin} className="space-y-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Label htmlFor="loginEmail">Email Perusahaan *</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="loginEmail"
                        type="email"
                        placeholder="nama@perusahaan.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        disabled={isLoading}
                        className="pl-10 border-2 border-border/50 focus:border-primary/50 h-11"
                      />
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <Label htmlFor="loginPassword">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="loginPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        disabled={isLoading}
                        className="pl-10 pr-10 border-2 border-border/50 focus:border-primary/50 h-11"
                      />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Masuk
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </>
                    )}
                  </motion.button>
                </motion.form>

                <p className="text-center text-sm text-muted-foreground">Hubungi admin untuk membuat akun baru</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAuth;
