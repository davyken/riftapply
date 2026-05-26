'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Briefcase, Upload, X, User } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { useT } from '@/lib/i18n/useT';
import LanguageToggle from '@/components/ui/LanguageToggle';

type AgentType = 'personal' | 'company';

export default function AgentRegisterPage() {
  const router = useRouter();
  const { T, t } = useT();

  const [agentType, setAgentType] = useState<AgentType>('personal');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '', city: '', companyName: '', companyLocation: '',
  });
  const [avatarFile, setAvatarFile]     = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cniFile, setCniFile]           = useState<File | null>(null);
  const [regFile, setRegFile]           = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError(T(t.registerAgent.passwordsMismatch)); return; }
    if (agentType === 'personal' && !cniFile) { setError(T(t.registerAgent.uploadCniError)); return; }
    if (agentType === 'company' && !regFile)  { setError(T(t.registerAgent.uploadRegError));  return; }

    const data = new FormData();
    data.append('firstName', form.firstName);
    data.append('lastName', form.lastName);
    data.append('email', form.email);
    data.append('password', form.password);
    data.append('phone', form.phone);
    data.append('agentType', agentType);
    if (avatarFile) data.append('avatar', avatarFile);
    if (agentType === 'personal') {
      data.append('city', form.city);
      data.append('cniDocument', cniFile!);
    } else {
      data.append('companyName', form.companyName);
      data.append('companyLocation', form.companyLocation);
      data.append('registrationDocument', regFile!);
    }

    setLoading(true);
    try {
      const res = await authApi.registerAgent(data);
      const { email: returnedEmail } = res.data;
      router.push(`/verify-email?email=${encodeURIComponent(returnedEmail || form.email)}&role=agent`);
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
        style={{ background: 'linear-gradient(135deg, #1a0a3a 0%, #3b1a6b 50%, #4a1e80 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.05) 60px,rgba(255,255,255,.05) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.05) 60px,rgba(255,255,255,.05) 61px)` }}
        />
        <div className="relative flex items-center gap-2 text-white">
          <div className="w-9 h-9 bg-purple-400 rounded-lg flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold">riftApply</span>
        </div>
        <div className="relative">
          <div className="w-16 h-16 bg-purple-400/20 rounded-2xl flex items-center justify-center mb-6">
            <Briefcase size={32} className="text-purple-300" />
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">{T(t.registerAgent.heroTitle)}</h1>
          <p className="text-purple-200 text-sm leading-relaxed max-w-xs">
            {T(t.registerAgent.heroSubtitle)}
          </p>
          <ul className="mt-6 space-y-2">
            {[
              T(t.registerAgent.heroFeature1),
              T(t.registerAgent.heroFeature2),
              T(t.registerAgent.heroFeature3),
              T(t.registerAgent.heroFeature4),
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-purple-200 text-sm">
                <span className="text-green-400">✓</span> {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-3">
            <p className="text-yellow-300 text-xs font-medium">⏳ {T(t.registerAgent.verificationRequired)}</p>
            <p className="text-yellow-200 text-xs mt-1">{T(t.registerAgent.verificationNote)}</p>
          </div>
        </div>
        <p className="relative text-purple-400 text-xs">
          {T(t.registerAgent.alreadyHave)}{' '}
          <a href="/login" className="text-white underline">{T(t.registerAgent.signIn)}</a>
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

          <h2 className="text-2xl font-bold text-gray-900 mb-1">{T(t.registerAgent.title)}</h2>
          <p className="text-sm text-gray-500 mb-3">{T(t.registerAgent.subtitle)}</p>
          <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2.5 mb-5">
            <span className="text-sm mt-0.5">⏳</span>
            <p className="text-xs text-yellow-800 leading-relaxed">
              {T(t.registerAgent.pendingNote)}
            </p>
          </div>

          {/* Account type toggle */}
          <div className="flex border border-gray-200 rounded-xl p-1 mb-6 bg-gray-50">
            {(['personal', 'company'] as AgentType[]).map((typ) => (
              <button key={typ} onClick={() => { setAgentType(typ); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all capitalize ${agentType === typ ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {typ === 'personal' ? `👤 ${T(t.registerAgent.personal)}` : `🏢 ${T(t.registerAgent.company)}`}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture */}
            <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner flex-shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-gray-355" size={24} />
                )}
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-700 mb-1">{T(t.registerStudent.profilePic)}</span>
                <div className="flex items-center gap-2">
                  <label className="bg-white hover:bg-purple-50 text-gray-600 text-[11px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-gray-200 flex items-center gap-1.5">
                    {T(t.registerStudent.chooseImage)}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
                      }}
                      className="hidden"
                    />
                  </label>
                  {avatarPreview && (
                    <button type="button" onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                      className="text-red-500 hover:text-red-700 text-[11px] font-semibold">
                      {T(t.registerStudent.remove)}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.common.firstName)} <span className="text-red-500">*</span></label>
                <input type="text" required value={form.firstName} onChange={(e) => update('firstName', e.target.value)}
                  placeholder="James" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.common.lastName)} <span className="text-red-500">*</span></label>
                <input type="text" required value={form.lastName} onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Miller" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.common.email)} <span className="text-red-500">*</span></label>
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
                  placeholder="james@agency.com" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.common.phone)} <span className="text-red-500">*</span></label>
                <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  placeholder="+1 555 000 0000" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Personal fields */}
            {agentType === 'personal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.common.city)}</label>
                <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)}
                  placeholder="London" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}

            {/* Company fields */}
            {agentType === 'company' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.registerAgent.companyName)} <span className="text-red-500">*</span></label>
                  <input type="text" required={agentType === 'company'} value={form.companyName} onChange={(e) => update('companyName', e.target.value)}
                    placeholder="Ahmadi Consulting" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{T(t.registerAgent.companyLocation)} <span className="text-red-500">*</span></label>
                  <input type="text" required={agentType === 'company'} value={form.companyLocation} onChange={(e) => update('companyLocation', e.target.value)}
                    placeholder="Paris, France" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            )}

            {/* Document upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {agentType === 'personal' ? T(t.registerAgent.cniDocument) : T(t.registerAgent.registrationDocument)}
                <span className="text-red-500"> *</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                {agentType === 'personal' ? T(t.registerAgent.cniDesc) : T(t.registerAgent.regDesc)}
              </p>
              {(agentType === 'personal' ? cniFile : regFile) ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Upload size={15} className="text-green-600" />
                  </div>
                  <span className="text-sm text-green-800 font-medium truncate flex-1">
                    {agentType === 'personal' ? cniFile?.name : regFile?.name}
                  </span>
                  <button type="button"
                    onClick={() => agentType === 'personal' ? setCniFile(null) : setRegFile(null)}
                    className="text-green-600 hover:text-red-500 flex-shrink-0 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <Upload size={20} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">{T(t.registerAgent.uploadFile)}</span>
                  <span className="text-xs text-gray-400 mt-1">{T(t.registerAgent.fileTypes)}</span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) agentType === 'personal' ? setCniFile(f) : setRegFile(f);
                    }} />
                </label>
              )}
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
              {loading ? T(t.registerAgent.creating) : T(t.registerAgent.createBtn)}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {T(t.registerAgent.alreadyHave)}{' '}
            <a href="/login" className="text-blue-600 font-medium hover:underline">{T(t.register.signIn)}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
