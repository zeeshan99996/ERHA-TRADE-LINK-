import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated network delay
    setTimeout(() => {
      const validEmail = 'admin@erha.pk';
      const validEmail2 = 'erhatradelinkinternational@gmail.com';
      const validPassword = 'admin';
      const validPassword2 = 'admin123';

      const checkEmail = email.trim().toLowerCase();
      
      if (
        (checkEmail === validEmail || checkEmail === validEmail2) && 
        (password === validPassword || password === validPassword2)
      ) {
        localStorage.setItem('erha_admin_auth', 'true');
        toast.success('Access Granted. Welcome back, Admin!');
        onLoginSuccess();
      } else {
        toast.error('Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleAutoFill = () => {
    setEmail('admin@erha.pk');
    setPassword('admin123');
    toast.info('Credentials pre-filled!');
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
            <p className="text-sm text-slate-400 mt-1.5">Control Center Authentication</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide block">ADMIN EMAIL</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@erha.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide block">PASSWORD</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500"
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

            {/* Actions */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper Card */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
            <p className="text-xs text-slate-500">Need quick testing credentials?</p>
            <button
              type="button"
              onClick={handleAutoFill}
              className="mt-2.5 px-4 py-2 bg-slate-850/40 hover:bg-slate-800/60 border border-slate-800 rounded-xl text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              🔑 Click to Auto-fill Demo
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
