import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, User, FileText, Briefcase, History, LogOut, Menu, X, Bell, Settings, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AlumniLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export const AlumniLayout: React.FC<AlumniLayoutProps> = ({ children, activeTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/alumni/dashboard",
      id: "dashboard",
    },
    {
      icon: User,
      label: "Profil Saya",
      href: "/alumni/dashboard?tab=profile",
      id: "profile",
    },
    {
      icon: FileText,
      label: "Dokumen",
      href: "/alumni/dashboard?tab=documents",
      id: "documents",
    },
    {
      icon: Briefcase,
      label: "Lowongan Kerja",
      href: "/alumni/dashboard?tab=jobs",
      id: "jobs",
    },
    {
      icon: History,
      label: "Riwayat Aktivitas",
      href: "/alumni/dashboard?tab=activities",
      id: "activities",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Auto-close sidebar on mobile after navigation
  const handleNavigate = (href: string) => {
    navigate(href);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Overlay - Mobile */}
      {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed md:relative w-64 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 flex flex-col ${isMobile && !sidebarOpen ? "-translate-x-full" : ""}`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-white">AC</span>
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">Alumni Hub</span>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id || (activeTab === undefined && item.id === "dashboard");
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground hidden md:block">Dashboard Alumni</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 h-auto p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/alumni/dashboard?tab=profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
