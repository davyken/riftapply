'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { UserRole } from '@/types';

const ROLE_REDIRECT: Record<string, string> = {
  student: '/student',
  agent:   '/agent',
  university: '/university',
  admin:   '/admin',
};

function VerifyEmailContent() {
  const router   = useRouter();
  const params   = useSearchParams();
  const setAuth  = useAuthStore((s) => s.setAuth);

  const email  = params.get('email') || '';
  const role   = params.get('role')  || 'student';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  // countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleDigit(index: number, value: string) {
    const v = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    setError('');
    if (v && index < 5) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(''));
      refs.current[5]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) { setError('Please enter all 6 digits.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authApi.verifyEmail(email, code, role);
      const { verified, pendingApproval, token, user } = res.data;

      if (pendingApproval) {
        // Agent / University: redirect to a pending-approval notice
        router.push(`/login?notice=pending&role=${role}`);
        return;
      }

      // Student / Admin: log them straight in
      if (token && user) {
        setAuth(user, token, role as UserRole);
        router.push(ROLE_REDIRECT[role] || '/student');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError('');
    setSuccess('');
    try {
      await authApi.resendVerificationCode(email, role);
      setSuccess('A new code has been sent to your email.');
      setCountdown(60);
      setCanResend(false);
      setDigits(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
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
            <Mail size={32} className="text-blue-300" />
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">Check Your Inbox</h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            We sent a 6-digit verification code to your email address. Enter it to confirm your identity and activate your account.
          </p>
          <ul className="mt-6 space-y-2">
            {[
              'Code expires in 10 minutes',
              'Check spam/junk if not found',
              'Request a new code if expired',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-blue-200 text-sm">
                <span className="text-green-400">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-blue-400 text-xs">
          Wrong account?{' '}
          <a href="/register" className="text-white underline">Register again</a>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
              <Mail size={28} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We sent a 6-digit code to<br />
              <span className="font-semibold text-gray-800">{email || 'your email'}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP digits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-3">
                Enter your verification code
              </label>
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { refs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                      d
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <CheckCircle size={16} /> {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || digits.join('').length < 6}
              className="w-full bg-[#1a3a6b] hover:bg-[#163060] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Verifying…' : 'Verify Email'}
            </button>
          </form>

          {/* Resend section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60"
              >
                <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                {resending ? 'Sending…' : 'Resend Code'}
              </button>
            ) : (
              <p className="text-sm text-gray-400">
                Resend available in <span className="font-semibold text-gray-600">{countdown}s</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
