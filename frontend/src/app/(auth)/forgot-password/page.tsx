'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';

type Role = 'student' | 'agent' | 'university' | 'admin';

const ROLE_LABELS: Record<Role, string> = {
  student:    'Student',
  agent:      'Agent',
  university: 'University',
  admin:      'Admin',
};

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [role, setRole]   = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [sent, setSent]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(email, role);
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-200">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Inbox</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            If an account with <strong className="text-gray-800">{email}</strong> exists, we've sent a 6-digit reset code to that address.
          </p>
          <button
            onClick={() =>
              router.push(
                `/reset-password?email=${encodeURIComponent(email)}&role=${role}`,
              )
            }
            className="w-full bg-[#1a3a6b] hover:bg-[#163060] text-white font-semibold py-3 rounded-lg text-sm transition-colors mb-3"
          >
            Enter Reset Code
          </button>
          <button
            onClick={() => { setSent(false); setEmail(''); }}
            className="text-sm text-blue-600 hover:underline"
          >
            Try a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2544 0%, #1a3a6b 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.05) 60px,rgba(255,255,255,.05) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.05) 60px,rgba(255,255,255,.05) 61px)` }}
        />
        <div className="relative flex items-center gap-2 text-white">
          <div className="w-9 h-9 bg-blue-400 rounded-lg flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold">riftApply</span>
        </div>
        <div className="relative">
          <div className="w-16 h-16 bg-blue-400/20 rounded-2xl flex items-center justify-center mb-6">
            <KeyRound size={32} className="text-blue-300" />
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">Forgot Your Password?</h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            No worries! Enter your email and we'll send you a code to reset your password securely.
          </p>
        </div>
        <p className="relative text-blue-400 text-xs">
          Remembered it?{' '}
          <a href="/login" className="text-white underline">Sign in</a>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-sm">
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Reset Password</h2>
            <p className="text-sm text-gray-500">Enter your email and we'll send you a reset code.</p>
          </div>

          {/* Role tabs */}
          <div className="flex border border-gray-200 rounded-lg p-1 mb-6 bg-gray-50">
            {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
              <button
                key={r}
                type="button"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="e.g. name@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3a6b] hover:bg-[#163060] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Sending…' : 'Send Reset Code'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Back to{' '}
            <a href="/login" className="text-blue-600 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
