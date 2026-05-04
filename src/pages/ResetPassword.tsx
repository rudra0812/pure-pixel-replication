import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the recovery flow. Supabase puts tokens in the URL hash.
    const initRecovery = async () => {
      const hash = window.location.hash;

      // Listen for the PASSWORD_RECOVERY event which fires after Supabase
      // processes the hash tokens.
      const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
          setSessionReady(true);
        }
      });

      // If the hash has tokens, manually parse and set the session as a fallback
      // (Supabase normally does this automatically, but timing can vary).
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.replace(/^#/, ""));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const type = params.get("type");

        if (access_token && refresh_token && type === "recovery") {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) {
            setSessionError("Reset link is invalid or expired. Please request a new one.");
          } else {
            setSessionReady(true);
          }
        }
      } else {
        // No hash — check if we already have an active session (some flows persist it)
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSessionReady(true);
        } else {
          setSessionError("Reset link is invalid or has expired. Please request a new one.");
        }
      }

      return () => sub.subscription.unsubscribe();
    };
    initRecovery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionReady) {
      toast({ title: "Session not ready", description: "Please wait or request a new reset link.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await updatePassword(password);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      setDone(true);
      toast({ title: "Password updated!" });
      // Sign out to force a fresh login with the new password
      await supabase.auth.signOut();
      setTimeout(() => navigate("/"), 2000);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-white flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {done ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Password Updated</h1>
            <p className="text-muted-foreground text-sm">Sign in with your new password...</p>
          </div>
        ) : sessionError ? (
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-foreground">Link Expired</h1>
            <p className="text-muted-foreground text-sm">{sessionError}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground text-center mb-2">Set New Password</h1>
            <p className="text-muted-foreground text-center text-sm mb-8">
              {sessionReady ? "Enter your new password below" : "Verifying your reset link..."}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl pl-10 pr-10"
                  disabled={!sessionReady}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-xl pl-10"
                  disabled={!sessionReady}
                />
              </div>
              <motion.button
                type="submit"
                disabled={isLoading || !sessionReady}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? "Updating..." : !sessionReady ? "Verifying..." : "Update Password"}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
