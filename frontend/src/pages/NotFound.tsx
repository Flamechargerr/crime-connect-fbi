import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield, AlertTriangle, Home, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-red-900/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* FBI Shield */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-4">
          <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold uppercase">
            Access Denied
          </span>
        </div>

        {/* Error Number */}
        <h1 className="text-8xl font-bold text-foreground mb-4 tracking-tighter">
          4<span className="text-red-500">0</span>4
        </h1>

        {/* Message */}
        <p className="text-xl text-foreground mb-2">
          Classification Error
        </p>
        <p className="text-muted-foreground mb-8">
          The requested resource <code className="px-2 py-0.5 rounded bg-muted text-foreground text-sm">{location.pathname}</code> does not exist in our classified database.
        </p>

        {/* Security Notice */}
        <div className="mb-8 p-4 rounded-lg bg-card border border-border text-left">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Security Notice</p>
              <p className="text-muted-foreground">
                This access attempt has been logged. If you believe this is an error, contact your system administrator.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="btn-pro">
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Return to Command Center
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-muted-foreground">
          FBI CrimeConnect © {new Date().getFullYear()} • Classified System
        </p>
      </div>
    </div>
  );
};

export default NotFound;
