import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Ignore Recharts removeChild errors - they're transient and don't affect functionality
    const isRechartsError = error.message?.includes("removeChild") || error.message?.includes("not a child") || error.message?.includes("<Text");

    if (isRechartsError) {
      console.warn("Recharts transient error suppressed:", error.message);
      return { hasError: false };
    }

    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ignore Recharts removeChild errors
    const isRechartsError = error.message?.includes("removeChild") || error.message?.includes("not a child") || error.message?.includes("<Text");

    if (!isRechartsError) {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="p-8 max-w-md w-full text-center bg-white/60 backdrop-blur-sm border-border/50">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Terjadi Kesalahan</h3>
                <p className="text-sm text-muted-foreground">Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi dukungan jika masalah berlanjut.</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={this.handleRetry} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Coba Lagi
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Muat Ulang Halaman
                </Button>
              </div>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-sm font-medium cursor-pointer text-muted-foreground">Detail Error (Development)</summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
