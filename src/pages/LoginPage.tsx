import { useState } from 'react';
import { Radio, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { classNames } from '@/lib/format';

export function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('r.hayes@vortexsec.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      if (!ok) setError('Invalid email or password. Please try again.');
      setLoading(false);
    }, 500);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-ink-900 border-r border-ink-700 p-12 relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Decorative scanline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-steel-500/40 to-transparent" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-steel-500 to-steel-700 flex items-center justify-center shadow-lg">
            <Radio size={22} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">VORTEX</span>
            <span className="text-lg font-bold text-steel-400">.AI</span>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            AI-Powered Security<br />Monitoring Platform
          </h1>
          <p className="text-ink-300 text-base leading-relaxed max-w-md mb-8">
            Real-time threat detection for gas stations and convenience stores.
            Inside-store concealment detection, exterior zone monitoring, and
            dwell-time alerts — all in one operational dashboard.
          </p>
          <div className="space-y-3">
            {[
              'Merchandise concealment detection',
              'Restricted zone & after-hours monitoring',
              'Vehicle dwell & loitering alerts',
              'Multi-store real-time overview',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-sm text-ink-200">
                <ShieldCheck size={18} className="text-steel-400 flex-shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-ink-500">
          © 2026 VORTEX.AI — Security Intelligence Platform
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-ink-950">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-steel-500 to-steel-700 flex items-center justify-center">
              <Radio size={20} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white">VORTEX</span>
              <span className="text-base font-bold text-steel-400">.AI</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-sm text-ink-400 mb-6">Sign in to your security dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label-text">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-base pl-9"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="label-text mb-0">Password</label>
                <button type="button" className="text-xs text-steel-400 hover:text-steel-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-base pl-9 pr-9"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-ink-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-ink-600 bg-ink-800 text-steel-600 focus:ring-steel-500/40"
              />
              Remember me
            </label>

            {error && (
              <div className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-sm text-danger-200 animate-slide-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-ink-700 bg-ink-850 px-4 py-3 text-xs text-ink-400">
            <span className="font-medium text-ink-300">Demo access:</span> Credentials are pre-filled. Just click Sign In.
          </div>
        </div>
      </div>
    </div>
  );
}
