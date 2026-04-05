import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatedGradient } from "./AnimatedGradient";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AuthScreenProps {
  onBack: () => void;
}

export const AuthScreen = ({ onBack }: AuthScreenProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    const result = isSignUp
      ? await signUp(email, password, name)
      : await signIn(email, password);

    if (result.error) {
      toast({ title: "Authentication Error", description: result.error, variant: "destructive" });
    } else if (isSignUp) {
      toast({ title: "Account created!", description: "Check your email to confirm your account." });
    }
    setIsLoading(false);
  };

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

        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="mb-2 text-title text-white text-center">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="mb-8 text-body text-white/70 text-center">
              {isSignUp ? "Start your journaling journey today" : "Sign in to continue"}
            </p>

            {/* Divider */}
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/30" />
              <span className="text-secondary text-white/60">email</span>
              <div className="h-px flex-1 bg-white/30" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl border-white/20 bg-white/95 pl-10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-white/20 bg-white/95 pl-10 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-white/20 bg-white/95 pl-10 pr-10 text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground touch-target"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="auth-button-primary w-full font-semibold disabled:opacity-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-secondary text-white/70">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-white underline underline-offset-2 touch-target"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedGradient>
  );
};
