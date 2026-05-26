'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Eye, EyeOff, ArrowLeft, User } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';

export default function StudentRegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '', city: '', desiredField: '', desiredModule: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key !== 'confirmPassword') {
          data.append(key, val);
        }
      });
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      const res = await authApi.registerStudent(data);
      const { token, user } = res.data;
      setAuth(user, token, 'student');
      router.push('/student');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[40%] flex-col justify-between p-10 relative overflow-hidden"
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
            <User size={32} className="text-blue-300" />
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">Student Account</h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            Create your profile, choose your desired field of study, and start applying to universities worldwide.
          </p>
          <ul className="mt-6 space-y-2">
            {['Apply to 500+ universities', 'Track every application in real time', 'Secure document storage', 'Free to use'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-blue-200 text-sm">
                <span className="text-green-400">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-blue-400 text-xs">Already have an account? <a href="/login" className="text-white underline">Sign in here</a></p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Student Account</h2>
          <p className="text-sm text-gray-500 mb-6">Fill in your details to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture */}
            <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner flex-shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-gray-350" size={24} />
                )}
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-700 mb-1">Profile Picture (Optional)</span>
                <div className="flex items-center gap-2">
                  <label className="bg-white hover:bg-blue-50 hover:text-blue-605 text-gray-600 text-[11px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-gray-200 flex items-center gap-1.5">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarFile(file);
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(null);
                      }}
                      className="text-red-500 hover:text-red-700 text-[11px] font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                <input type="text" required value={form.firstName} onChange={(e) => update('firstName', e.target.value)}
                  placeholder="Ahmed" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                <input type="text" required value={form.lastName} onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Mohamed" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
                placeholder="ahmed@example.com" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Phone + City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  placeholder="+1 555 000 0000" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)}
                  placeholder="Casablanca" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Desired field + Module */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desired Field</label>
                <input type="text" value={form.desiredField} onChange={(e) => update('desiredField', e.target.value)}
                  placeholder="Engineering" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desired Module</label>
                <input type="text" value={form.desiredModule} onChange={(e) => update('desiredModule', e.target.value)}
                  placeholder="Computer Science" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)}
                  placeholder="Min. 6 characters" minLength={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
              <input type="password" required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="Repeat your password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="terms" required className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I accept the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">Terms and Services</a>
              </label>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#1a3a6b] hover:bg-[#163060] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-colors mt-2">
              {loading ? 'Creating account…' : 'Create Student Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
