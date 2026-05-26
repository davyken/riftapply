'use client';
import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, KeyRound, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';

function ResetPasswordContent() {
  const router  = useRouter();
  const params  = useSearchParams();

  const email = params.get('email') || '';
  const role  = params.get('role')  || 'student';

  const [digits, setDigits]       = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPw]   = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [done, setDone]           = useState(false);
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
    if (code.length < 6) { setError('Please enter the 6-digit code.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPw) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');
    try {
      await authApi.resetPassword(email, code, newPassword, role);
      setDone(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-200">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#1a3a6b] hover:bg-[#163060] text-white font-semibold py-3 rounded-lg text-sm transition-colors"
          >
            Go to Sign In
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
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">Set New Password</h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            Enter the 6-digit code from your email and choose a strong new password.
          </p>
        </div>
        <p className="relative text-blue-400 text-xs">
          Remembered it?{' '}
          <a href="/login" className="text-white underline">Sign in</a>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md">
          <button
            onClick={() => router.push('/forgot-password')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Reset Your Password</h2>
            <p className="text-sm text-gray-500">
              Enter the code sent to <strong className="text-gray-700">{email}</strong> and your new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Code digits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-3">
                Enter your 6-digit reset code
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

            {/* New password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => { setNewPw(e.target.value); setError(''); }}
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPw}
                onChange={(e) => { setConfirmPw(e.target.value); setError(''); }}
                placeholder="Repeat your new password"
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
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Didn't receive a code?{' '}
            <a href={`/forgot-password`} className="text-blue-600 font-medium hover:underline">
              Request again
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
