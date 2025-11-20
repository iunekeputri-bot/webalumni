import React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  label?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "destructive";
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ value, size = 120, strokeWidth = 8, className, showValue = true, label, color = "primary" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-green-500",
    warning: "text-yellow-500",
    destructive: "text-destructive",
  };

  const bgColorClasses = {
    primary: "text-primary/20",
    secondary: "text-secondary/20",
    success: "text-green-500/20",
    warning: "text-yellow-500/20",
    destructive: "text-destructive/20",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className={bgColorClasses[color]} />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(colorClasses[color], "transition-all duration-1000 ease-out")}
          style={{
            filter: `drop-shadow(0 0 4px ${color === "primary" ? "hsl(var(--primary))" : color === "secondary" ? "hsl(var(--secondary))" : color === "success" ? "#22c55e" : color === "warning" ? "#eab308" : "hsl(var(--destructive))"})`,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-bold", colorClasses[color])}>{Math.round(value)}%</span>
          {label && <span className="text-xs text-muted-foreground mt-1 text-center">{label}</span>}
        </div>
      )}
    </div>
  );
};

// Profile completion variant
export const ProfileCompletionIndicator: React.FC<{
  completion: number;
  size?: number;
  className?: string;
}> = ({ completion, size = 80, className }) => {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <CircularProgress value={completion} size={size} color={completion >= 80 ? "success" : completion >= 50 ? "warning" : "primary"} showValue={true} label="Lengkap" />
      <div className="text-center">
        <p className="text-sm font-medium">Kelengkapan Profil</p>
        <p className="text-xs text-muted-foreground">
          {completion < 50 && "Tambah informasi untuk meningkatkan visibilitas"}
          {completion >= 50 && completion < 80 && "Hampir selesai! Lengkapi detail lainnya"}
          {completion >= 80 && "Profil Anda sudah lengkap!"}
        </p>
      </div>
    </div>
  );
};
