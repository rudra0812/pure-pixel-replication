import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AnimatedGradient } from "./AnimatedGradient";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, CheckCircle2, LogIn, UserPlus, KeyRound, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AuthScreenProps {
  onBack: () => void;
}

type TabKey = "signin" | "signup" | "forgot";

export const AuthScreen = ({ onBack }: AuthScreenProps) => {
  const [tab, setTab] = useState<TabKey>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn, resetPassword } = useAuth();
  const { toast } = useToast();

  const switchTab = (next: TabKey) => {
    setTab(next);
    setForgotSent(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "Couldn't sign in", description: error, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(email, password, name);
    if (error) {
      toast({ title: "Couldn't create account", description: error, variant: "destructive" });
    } else {
      toast({ title: `Welcome, ${name}!`, description: "Your garden is ready to grow." });
    }
    setIsLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await resetPassword(forgotEmail);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      setForgotSent(true);
    }
    setIsLoading(false);
  };

  const tabs: { key: TabKey; label: string; icon: typeof LogIn }[] = [
    { key: "signin", label: "Sign In", icon: LogIn },
    { key: "signup", label: "Sign Up", icon: UserPlus },
    { key: "forgot", label: "Reset", icon: KeyRound },
  ];

  return (
    <AnimatedGradient variant="calm">
      <div className="flex min-h-screen flex-col safe-area-top safe-area-bottom">
        <motion.header
          className="flex items-center px-4 py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur touch-target"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
        </motion.header>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-6">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {/* Brand mark */}
            <div className="mb-6 flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl ring-1 ring-white/30 shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
            </div>



            <AnimatePresence mode="wait">
              {tab === "signin" && (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="mb-1 text-title text-white text-center">Welcome back</h1>
                  <p className="mb-6 text-body text-white/70 text-center">Sign in to continue your journey</p>
                  <form onSubmit={handleSignIn} className="space-y-3">
                    <FieldEmail value={email} onChange={setEmail} />
                    <FieldPassword value={password} onChange={setPassword} show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => { setForgotEmail(email); switchTab("forgot"); }}
                        className="text-xs text-white/80 hover:text-white underline underline-offset-2"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <SubmitButton loading={isLoading} label="Sign In" loadingLabel="Signing in..." />
                  </form>
                  <p className="mt-5 text-center text-secondary text-white/70">
                    New here?{" "}
                    <button onClick={() => switchTab("signup")} className="font-medium text-white underline underline-offset-2">
                      Create an account
                    </button>
                  </p>
                </motion.div>
              )}

              {tab === "signup" && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="mb-1 text-title text-white text-center">Create your garden</h1>
                  <p className="mb-6 text-body text-white/70 text-center">Plant your first seed in seconds</p>
                  <form onSubmit={handleSignUp} className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 rounded-xl border-white/20 bg-white/95 pl-10 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <FieldEmail value={email} onChange={setEmail} />
                    <FieldPassword value={password} onChange={setPassword} show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                    <p className="text-xs text-white/60 px-1">At least 8 characters. Mix letters and numbers for safety.</p>
                    <SubmitButton loading={isLoading} label="Create Account" loadingLabel="Creating..." />
                  </form>
                  <p className="mt-5 text-center text-secondary text-white/70">
                    Already have an account?{" "}
                    <button onClick={() => switchTab("signin")} className="font-medium text-white underline underline-offset-2">
                      Sign In
                    </button>
                  </p>
                </motion.div>
              )}

              {tab === "forgot" && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {forgotSent ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      </div>
                      <h1 className="text-title text-white">Check your email</h1>
                      <p className="text-body text-white/80">
                        If an account exists for <strong className="text-white">{forgotEmail}</strong>, a reset link is on its way.
                      </p>
                      <p className="text-xs text-white/60">
                        Didn't get it? Check spam, or try again in a minute.
                      </p>
                      <button
                        onClick={() => switchTab("signin")}
                        className="text-white underline underline-offset-2 text-sm"
                      >
                        Back to sign in
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="mb-1 text-title text-white text-center">Reset password</h1>
                      <p className="mb-6 text-body text-white/70 text-center">
                        Enter your email and we'll send a reset link
                      </p>
                      <form onSubmit={handleForgot} className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="Email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="h-12 rounded-xl border-white/20 bg-white/95 pl-10 text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                        <SubmitButton loading={isLoading} label="Send Reset Link" loadingLabel="Sending..." />
                      </form>
                      <p className="mt-5 text-center text-secondary text-white/70">
                        Remembered it?{" "}
                        <button onClick={() => switchTab("signin")} className="font-medium text-white underline underline-offset-2">
                          Sign In
                        </button>
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AnimatedGradient>
  );
};

const FieldEmail = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="relative">
    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
    <Input
      type="email"
      placeholder="Email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 rounded-xl border-white/20 bg-white/95 pl-10 text-foreground placeholder:text-muted-foreground"
    />
  </div>
);

const FieldPassword = ({ value, onChange, show, onToggle }: { value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void }) => (
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
    <Input
      type={show ? "text" : "password"}
      placeholder="Password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 rounded-xl border-white/20 bg-white/95 pl-10 pr-10 text-foreground placeholder:text-muted-foreground"
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground touch-target"
    >
      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  </div>
);

const SubmitButton = ({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) => (
  <motion.button
    type="submit"
    disabled={loading}
    className="auth-button-primary w-full font-semibold disabled:opacity-50"
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
  >
    {loading ? loadingLabel : label}
  </motion.button>
);
