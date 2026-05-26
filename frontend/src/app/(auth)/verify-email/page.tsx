'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Mail, ArrowLeft, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { UserRole } from '@/types';
import { useT } from '@/lib/i18n/useT';
import LanguageToggle from '@/components/ui/LanguageToggle';

const ROLE_REDIRECT: Record<string, string> = {
  student:    '/student',
  agent:      '/agent',
  university: '/university',
  admin:      '/admin',
};

const EXPIRY_SECONDS = 5 * 60; // 5 minutes — must match backend

function VerifyEmailContent() {
  const router  = useRouter();
  const params  = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { T, t } = useT();

  const email = params.get('email') || '';
  const role  = params.get('role')  || 'student';

  const [digits, setDigits]       = useState(['', '', '', '', '', '']);
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  // ── 5-min expiry countdown ──────────────────────────────────────
  const [expiryLeft, setExpiryLeft] = useState(EXPIRY_SECONDS);
  const [expired, setExpired]       = useState(false);

  useEffect(() => {
    if (expiryLeft <= 0) { setExpired(true); return; }
    const timer = setTimeout(() => setExpiryLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [expiryLeft]);

  const expiryMins    = Math.floor(expiryLeft / 60);
  const expirySecs    = expiryLeft % 60;
  const expiryDisplay = `${expiryMins}:${String(expirySecs).padStart(2, '0')}`;
  const expiryUrgent  = expiryLeft <= 60;

  // ── resend cooldown ─────────────────────────────────────────────
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend]           = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const refs = useRef<Array<HTMLInputElement | null>>([]);

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
      const { pendingApproval, token, user } = res.data;

      if (pendingApproval) {
        router.push(`/login?notice=pending&role=${role}`);
        return;
      }
      if (token && user) {
        setAuth(user, token, role as UserRole);
        router.push(ROLE_REDIRECT[role] || '/student');
      }
    } catch (err: any) {
      const msg: string = err?.response?.data?.message || 'Verification failed. Please try again.';
      if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('register again')) {
        setExpired(true);
      } else {
        setError(msg);
      }
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
      setResendCooldown(60);
      setCanResend(false);
      setExpiryLeft(EXPIRY_SECONDS);
      setExpired(false);
      setDigits(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } catch (err: any) {
      const msg: string = err?.response?.data?.message || 'Failed to resend code.';
      if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('register again')) {
        setExpired(true);
      } else {
        setError(msg);
      }
    } finally {
      setResending(false);
    }
  }

  // ── EXPIRED SCREEN ──────────────────────────────────────────────
  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{T(t.verifyEmail.expiredTitle)}</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {T(t.verifyEmail.expiredMsg)}
          </p>
          <a href="/register"
            className="block w-full bg-[#1a3a6b] hover:bg-[#163060] text-white font-semibold py-3 rounded-lg text-sm transition-colors text-center">
            {T(t.verifyEmail.registerAgainBtn)}
          </a>
          <a href="/login" className="inline-block mt-3 text-sm text-blue-600 hover:underline">
            {T(t.verifyEmail.alreadyHave)}
          </a>
        </div>
      </div>
    );
  }

  // ── MAIN VERIFY SCREEN ──────────────────────────────────────────
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
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">{T(t.verifyEmail.heroTitle)}</h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            {T(t.verifyEmail.heroSubtitle)}
          </p>
          <ul className="mt-6 space-y-2">
            {[
              T(t.verifyEmail.hints.h1),
              T(t.verifyEmail.hints.h2),
              T(t.verifyEmail.hints.h3),
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-blue-200 text-sm">
                <span className="text-green-400">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-blue-400 text-xs">
          {T(t.verifyEmail.wrongAccount)}{' '}
          <a href="/register" className="text-white underline">{T(t.verifyEmail.registerAgain)}</a>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => router.back()}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft size={16} /> {T(t.common.back)}
            </button>
            <LanguageToggle />
          </div>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
              <Mail size={28} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{T(t.verifyEmail.title)}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {T(t.verifyEmail.sentTo)}<br />
              <span className="font-semibold text-gray-800">{email || T(t.verifyEmail.yourEmail)}</span>
            </p>
          </div>

          {/* ── Live expiry countdown ── */}
          <div className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 mb-5 border ${
            expiryUrgent
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}>
            <Clock size={15} />
            <span className="text-sm font-medium">
              {expiryUrgent ? T(t.verifyEmail.hurry) : T(t.verifyEmail.codeExpires)}{' '}
              <span className="font-bold tabular-nums">{expiryDisplay}</span>
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-3">
                {T(t.verifyEmail.codeLabel)}
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
                      d ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-900'
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
              {loading ? T(t.verifyEmail.verifying) : T(t.verifyEmail.verifyBtn)}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500 mb-2">{T(t.verifyEmail.didntReceive)}</p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60"
              >
                <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                {resending ? T(t.verifyEmail.resending) : T(t.verifyEmail.resend)}
              </button>
            ) : (
              <p className="text-sm text-gray-400">
                {T(t.verifyEmail.resendAvailable)}{' '}
                <span className="font-semibold text-gray-600">{resendCooldown}s</span>
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
