'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Clock } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';

type Role = 'student' | 'agent' | 'university' | 'admin';

const ROLE_LABELS: Record<Role, string> = {
  student: 'Student',
  agent: 'Agent',
  university: 'University',
  admin: 'Admin',
};

const ROLE_REDIRECT: Record<Role, string> = {
  student: '/student',
  agent: '/agent',
  university: '/university',
  admin: '/admin',
};

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const notice = params.get('notice'); // 'pending'
  const noticeRole = params.get('role') || '';

  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginFns: Record<Role, (e: string, p: string) => ReturnType<typeof authApi.loginStudent>> = {
    student: authApi.loginStudent,
    agent: authApi.loginAgent,
    university: authApi.loginUniversity,
    admin: authApi.loginAdmin,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginFns[role](email, password);
      const { token, user } = res.data;
      setAuth(user, token, role);
      router.push(ROLE_REDIRECT[role]);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" suppressHydrationWarning>
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2544 0%, #1a3a6b 40%, #1e4080 100%)' }}
      >
        {/* library overlay grid */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.04) 60px,rgba(255,255,255,.04) 61px), repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.04) 60px,rgba(255,255,255,.04) 61px)`,
          }}
        />
        {/* bookshelf silhouette rows */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, #fff 0px, #fff 8px, transparent 8px, transparent 24px)`,
            backgroundSize: '24px 100%',
            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-2 text-white">
          <div className="w-9 h-9 bg-blue-400 rounded-lg flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">riftApply</span>
        </div>

        {/* Hero text */}
        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Your gateway to<br />academic excellence.
          </h1>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            Join thousands of students and institutions in a streamlined, authoritative admissions journey.
          </p>
        </div>

        {/* Testimonial */}
        <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
          <p className="text-blue-100 text-sm italic leading-relaxed">
            "The most efficient portal for managing global university applications I've used in a decade."
          </p>
          <p className="text-blue-300 text-xs mt-3 font-medium">— Dean of Admissions, Global Heights</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-[#1a3a6b] rounded-lg flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-[#1a3a6b]">riftApply</span>
        </div>

        <div className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          {notice === 'pending' && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
              <Clock size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Account Pending Approval</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  Your email is verified! Your {noticeRole} account is now pending admin review. You'll be able to log in once approved — usually within 15–30 minutes during business hours.
                </p>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Please select your role and enter your details.</p>

          {/* Role tabs */}
          <div className="flex border border-gray-200 rounded-lg p-1 mb-6 bg-gray-50">
            {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setError(''); }}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                  role === r
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@university.edu"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href={`/forgot-password`} className="text-xs text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Stay signed in for 30 days</span>
            </label>

            {/* Terms of Service */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
              />
              <span className="text-sm text-gray-600">
                I agree to the <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</a>
              </span>
            </label>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3a6b] hover:bg-[#163060] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Signing in…' : `Sign In as ${ROLE_LABELS[role]}`}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* SSO buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <div className="w-4 h-4 bg-[#1a3a6b] rounded-sm flex items-center justify-center">
                <GraduationCap size={10} className="text-white" />
              </div>
              SSO
            </button>
          </div>

          {role !== 'admin' && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 font-medium hover:underline">
                Create an account
              </a>
            </p>
          )}

          <div className="flex justify-center gap-4 mt-6 text-xs text-gray-400">
            <a href="/privacy-policy" className="hover:text-gray-600">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-gray-600">Terms of Service</a>
            <a href="/help" className="hover:text-gray-600">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
