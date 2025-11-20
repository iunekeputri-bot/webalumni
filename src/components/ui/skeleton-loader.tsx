import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface SkeletonLoaderProps {
  variant?: "card" | "list" | "form" | "stats" | "document";
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = "card", count = 1 }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </Card>
        );

      case "list":
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        );

      case "form":
        return (
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-border/50">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </Card>
        );

      case "stats":
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border bg-gradient-to-br from-muted/20 to-muted/10 hover:border-primary/50 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
              </Card>
            ))}
          </div>
        );

      case "document":
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex gap-2 ml-4">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <Skeleton className="h-32 w-full" />;
    }
  };

  return <>{renderSkeleton()}</>;
};
