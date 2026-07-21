import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Security: Brute Force Lockout State (persisted via localStorage)
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('erha_admin_failed_attempts') || '0', 10);
  });
  const [lockoutTime, setLockoutTime] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const until = localStorage.getItem('erha_admin_lockout_until');
    if (until) {
      const untilMs = parseInt(until, 10);
      if (untilMs > Date.now()) return untilMs;
    }
    return 0;
  });
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (lockoutTime > Date.now()) {
      const interval = setInterval(() => {
        const left = Math.ceil((lockoutTime - Date.now()) / 1000);
        if (left <= 0) {
          setLockoutTime(0);
          setFailedAttempts(0);
          localStorage.removeItem('erha_admin_failed_attempts');
          localStorage.removeItem('erha_admin_lockout_until');
          clearInterval(interval);
        } else {
          setSecondsLeft(left);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if currently locked out
    if (lockoutTime > Date.now()) {
      toast.error(`Account temporarily locked. Please wait ${secondsLeft} seconds.`);
      return;
    }

    setIsLoading(true);

    try {
      const res = await db.loginAdmin(email, password);
      if (res.success) {
        // Reset failed attempts upon successful authentication
        setFailedAttempts(0);
        localStorage.removeItem('erha_admin_failed_attempts');
        localStorage.removeItem('erha_admin_lockout_until');

        if (rememberMe) {
          localStorage.setItem('erha_admin_auth', 'true');
        } else {
          sessionStorage.setItem('erha_admin_auth', 'true');
        }

        if (res.user) {
          if (res.user.email) {
            if (rememberMe) {
              localStorage.setItem('erha_admin_email', res.user.email);
            } else {
              sessionStorage.setItem('erha_admin_email', res.user.email);
            }
          }
          if (res.user.role) {
            db.setUserRole(res.user.role);
          }
        }
        toast.success(`Access Granted. Welcome back, ${res.user?.name || 'Admin'}!`);
        onLoginSuccess();
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        localStorage.setItem('erha_admin_failed_attempts', nextFailed.toString());

        if (nextFailed >= 5) {
          const blockUntil = Date.now() + 60000; // 1 minute lockout
          setLockoutTime(blockUntil);
          localStorage.setItem('erha_admin_lockout_until', blockUntil.toString());
          toast.error('Too many failed login attempts. Portal access locked for 60 seconds.');
        } else {
          toast.error(res.message || `Invalid email or password. Attempt ${nextFailed} of 5.`);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19] overflow-hidden">
      {/* ─── Glowing Background Blobs ─── */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4 relative z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative">
          
          {/* Logo / Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
              <Zap size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">ERHA Trade Link</h2>
            <p className="text-sm text-slate-400 mt-1.5 font-medium">Control Center Authentication</p>
          </div>

          <AnimatePresence mode="wait">
            {lockoutTime > Date.now() ? (
              <motion.div
                key="lockout"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert size={32} />
                </div>
                <h3 className="text-lg font-bold text-white">System Temporarily Locked</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">
                  Too many failed authentication attempts. Access is suspended for security purposes.
                </p>
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 font-mono tracking-wider pt-2">
                  {secondsLeft}s
                </div>
                <p className="text-xs text-slate-500">Form will auto-unlock when timer completes.</p>
              </motion.div>
            ) : (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 tracking-wide block">ADMIN EMAIL</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-650 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 tracking-wide block">PASSWORD</label>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-650 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-slate-400 cursor-pointer">
                    Remember me
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Authenticate <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
