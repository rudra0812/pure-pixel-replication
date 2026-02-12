import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { AnimatedGradient } from "./AnimatedGradient";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { authFormSchema } from "@/lib/validation";

interface AuthScreenProps {
  onBack: () => void;
  onAuthenticated: () => void;
}

export const AuthScreen = ({ onBack, onAuthenticated }: AuthScreenProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signUp, signIn, error: authError } = useAuth();

  // Validate form fields
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    try {
      authFormSchema.parse({
        name: isSignUp ? name : undefined,
        email,
        password,
      });
      setErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path[0] || 'general';
          newErrors[path] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  }, [isSignUp, name, email, password]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        if (isSignUp) {
          await signUp(email, password, name);
        } else {
          await signIn(email, password);
        }
        onAuthenticated();
      } catch (error) {
        console.error('[Auth] Error:', error);
        // Error is handled by useAuth hook and displayed via authError
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSignUp, email, password, name, validateForm, signUp, signIn, onAuthenticated]
  );

  return (
    <AnimatedGradient variant="calm">
      <div className="flex min-h-screen flex-col safe-area-top safe-area-bottom">
        {/* Header */}
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

        {/* Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Title */}
            <h1 className="mb-2 text-title text-white text-center">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="mb-8 text-body text-white/70 text-center">
              {isSignUp 
                ? "Start your journaling journey today" 
                : "Sign in to continue"}
            </p>

            {/* Social Auth Buttons */}
            <div className="mb-6 space-y-3">
              <motion.button
                className="auth-button-social bg-white/95"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onAuthenticated}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-foreground">Continue with Google</span>
              </motion.button>

              <motion.button
                className="auth-button-social bg-white/95"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onAuthenticated}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="font-medium text-foreground">Sign in with Apple</span>
              </motion.button>
            </div>

            {/* Divider */}
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/30" />
              <span className="text-secondary text-white/60">or</span>
              <div className="h-px flex-1 bg-white/30" />
            </div>

            {/* Error Alert */}
            {(authError || Object.keys(errors).length > 0) && (
              <motion.div
                className="mb-4 flex items-start gap-3 rounded-lg bg-red-100 p-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div className="text-sm">
                  {authError && <p className="font-medium text-red-700">{authError}</p>}
                  {Object.entries(errors).map(([key, message]) => (
                    <p key={key} className="text-red-600">
                      {message}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-label="Full Name"
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`h-12 rounded-xl border-white/20 bg-white/95 pl-10 text-foreground placeholder:text-muted-foreground ${
                        errors.name ? 'border-red-500 border-2' : ''
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`h-12 rounded-xl border-white/20 bg-white/95 pl-10 text-foreground placeholder:text-muted-foreground ${
                      errors.email ? 'border-red-500 border-2' : ''
                    }`}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`h-12 rounded-xl border-white/20 bg-white/95 pl-10 pr-10 text-foreground placeholder:text-muted-foreground ${
                      errors.password ? 'border-red-500 border-2' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground touch-target"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className="auth-button-primary w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent" />
                    </motion.div>
                    Loading...
                  </span>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </motion.button>
            </form>

            {/* Toggle Auth Mode */}
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
