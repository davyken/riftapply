'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Building2, Upload, X } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { useT } from '@/lib/i18n/useT';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function UniversityRegisterPage() {
  const router = useRouter();
  const { T, t } = useT();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', city: '', district: '', address: '', website: '',
  });
  const [logoFile, setLogoFile]       = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  function handleLogoChange(file: File) {
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError(T(t.registerUniversity.passwordsMismatch)); return; }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k !== 'confirmPassword' && v) data.append(k, v);
    });
    if (logoFile) data.append('logo', logoFile);

    setLoading(true);
    try {
      const res = await authApi.registerUniversity(data);
      const { email: returnedEmail } = res.data;
      router.push(`/verify-email?email=${encodeURIComponent(returnedEmail || form.email)}&role=university`);
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
        className="hidden lg:flex lg:w-[38%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #063a1e 0%, #0a5e2f 50%, #0d7a3c 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.05) 60px,rgba(255,255,255,.05) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.05) 60px,rgba(255,255,255,.05) 61px)` }}
        />
        <div className="relative flex items-center gap-2 text-white">
          <div className="w-9 h-9 bg-green-400 rounded-lg flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold">riftApply</span>
        </div>
        <div className="relative">
          <div className="w-16 h-16 bg-green-400/20 rounded-2xl flex items-center justify-center mb-6">
            <Building2 size={32} className="text-green-300" />
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">{T(t.registerUniversity.heroTitle)}</h1>
          <p className="text-green-100 text-sm leading-relaxed max-w-xs">
            {T(t.registerUniversity.heroSubtitle)}
          </p>
          <ul className="mt-6 space-y-2">
            {[
              T(t.registerUniversity.heroFeature1),
              T(t.registerUniversity.heroFeature2),
              T(t.registerUniversity.heroFeature3),
              T(t.registerUniversity.heroFeature4),
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-green-100 text-sm">
                <span className="text-green-400">✓</span> {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 bg-green-400/10 border border-green-400/30 rounded-lg px-4 py-3 space-y-1.5">
            <p className="text-green-300 text-xs font-semibold">⏳ {T(t.registerAgent.verificationRequired)}</p>
            <p className="text-green-200 text-xs"><span className="font-semibold text-white">Step 1 —</span> {T(t.registerUniversity.step1)}</p>
            <p className="text-green-200 text-xs"><span className="font-semibold text-white">Step 2 —</span> {T(t.registerUniversity.step2)}</p>
          </div>
        </div>
        <p className="relative text-green-400 text-xs">
          {T(t.registerUniversity.alreadyHave)}{' '}
          <a href="/login" className="text-white underline">{T(t.registerUniversity.signIn)}</a>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft size={16} /> {T(t.common.back)}
            </button>
            <LanguageToggle />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">{T(t.registerUniversity.title)}</h2>
          <p className="text-sm text-gray-500 mb-3">{T(t.registerUniversity.subtitle)}</p>
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 mb-5">
            <span className="text-blue-500 text-sm mt-0.5">ℹ️</span>
            <p className="text-xs text-blue-700 leading-relaxed">
              {T(t.registerUniversity.approvalNote)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Logo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{T(t.registerUniversity.logo)}</label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                    <Building2 size={20} className="text-gray-300" />
                  </div>
                )}
                <label className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload size={15} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{logoFile ? logoFile.name : T(t.registerUniversity.uploadLogo)}</span>
                  <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.svg,.webp"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoChange(f); }} />
                </label>
              </div>
            </div>

            {/* University name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.registerUniversity.universityName)} <span className="text-red-500">*</span></label>
              <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)}
                placeholder="University of Excellence" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.registerUniversity.officialEmail)} <span className="text-red-500">*</span></label>
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
                  placeholder="admissions@university.edu" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.common.phone)} <span className="text-red-500">*</span></label>
                <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  placeholder="+44 20 7946 0000" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* City + District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.common.city)} <span className="text-red-500">*</span></label>
                <input type="text" required value={form.city} onChange={(e) => update('city', e.target.value)}
                  placeholder="London" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.registerUniversity.district)}</label>
                <input type="text" value={form.district} onChange={(e) => update('district', e.target.value)}
                  placeholder="South Kensington" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Address + Website */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.registerUniversity.address)}</label>
                <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)}
                  placeholder="Exhibition Road, SW7 2AZ" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.registerUniversity.website)}</label>
                <input type="url" value={form.website} onChange={(e) => update('website', e.target.value)}
                  placeholder="https://www.university.edu" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.common.password)} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)}
                    placeholder={T(t.registerStudent.minPassword)} minLength={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.registerStudent.confirmPassword)} <span className="text-red-500">*</span></label>
                <input type="password" required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder={T(t.registerStudent.confirmPlaceholder)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="terms" required className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                {T(t.registerStudent.acceptTerms)}{' '}
                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                  {T(t.registerStudent.termsLink)}
                </a>
              </label>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#1a3a6b] hover:bg-[#163060] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-colors">
              {loading ? T(t.registerUniversity.creating) : T(t.registerUniversity.createBtn)}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {T(t.registerUniversity.alreadyHave)}{' '}
            <a href="/login" className="text-blue-600 font-medium hover:underline">{T(t.register.signIn)}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
