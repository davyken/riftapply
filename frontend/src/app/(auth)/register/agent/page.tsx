'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Briefcase, Upload, X, User } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';

type AgentType = 'personal' | 'company';

export default function AgentRegisterPage() {
  const router = useRouter();

  const [agentType, setAgentType] = useState<AgentType>('personal');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '', city: '',
    companyName: '', companyLocation: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cniFile, setCniFile] = useState<File | null>(null);
  const [regFile, setRegFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (agentType === 'personal' && !cniFile) { setError('Please upload your CNI / ID document'); return; }
    if (agentType === 'company' && !regFile) { setError('Please upload the company registration document'); return; }

    const data = new FormData();
    data.append('firstName', form.firstName);
    data.append('lastName', form.lastName);
    data.append('email', form.email);
    data.append('password', form.password);
    data.append('phone', form.phone);
    data.append('agentType', agentType);
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }
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
      await authApi.registerAgent(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full shadow-sm">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Briefcase size={28} className="text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Application Submitted!</h2>
          <p className="text-sm text-gray-500 text-center mb-7">
            Your agent account is now under review. Here's what happens next:
          </p>

          <div className="space-y-4 mb-7">
            {[
              {
                n: 1,
                title: 'Admin reviews your documents',
                desc: 'Our team verifies your identity or company registration. This takes between 15 and 30 minutes during business hours.',
                icon: '🔍',
              },
              {
                n: 2,
                title: 'You receive a confirmation',
                desc: 'Once approved, your account becomes active. You can try logging in after 15–30 minutes. If rejected, you\'ll see the reason on your dashboard.',
                icon: '✅',
              },
              {
                n: 3,
                title: 'Start submitting applications',
                desc: 'Log in, search for universities, and submit applications on behalf of your students right away.',
                icon: '🚀',
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a3a6b] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {step.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{step.icon} {step.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-xs text-yellow-800 font-semibold">⏳ Estimated wait: 15 to 30 minutes</p>
            <p className="text-xs text-yellow-700 mt-0.5">If you don't hear back within 1 hour, contact <span className="font-medium">support@riftapply.com</span></p>
          </div>

          <a href="/login" className="block w-full text-center bg-[#1a3a6b] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#163060] transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">Agent Account</h1>
          <p className="text-purple-200 text-sm leading-relaxed max-w-xs">
            Join as an individual agent or represent your company. All accounts require document verification before activation.
          </p>
          <ul className="mt-6 space-y-2">
            {['Manage multiple student applications', 'Commission tracking & reporting', 'Priority support from our team', 'Verified badge on your profile'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-purple-200 text-sm">
                <span className="text-green-400">✓</span> {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-3">
            <p className="text-yellow-300 text-xs font-medium">⏳ Verification required</p>
            <p className="text-yellow-200 text-xs mt-1">An admin reviews your documents within <strong>15 to 30 minutes</strong>. You can log in as soon as your account is approved.</p>
          </div>
        </div>
        <p className="relative text-purple-400 text-xs">Already have an account? <a href="/login" className="text-white underline">Sign in here</a></p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Agent Account</h2>
          <p className="text-sm text-gray-500 mb-3">Choose your account type and upload your verification document.</p>
          <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2.5 mb-5">
            <span className="text-sm mt-0.5">⏳</span>
            <p className="text-xs text-yellow-800 leading-relaxed">
              After submitting, an admin will review your documents within <strong>15 to 30 minutes</strong>. You can log in as soon as your account is approved.
            </p>
          </div>

          {/* Account type toggle */}
          <div className="flex border border-gray-200 rounded-xl p-1 mb-6 bg-gray-50">
            {(['personal', 'company'] as AgentType[]).map((t) => (
              <button key={t} onClick={() => { setAgentType(t); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all capitalize ${agentType === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t === 'personal' ? '👤 Personal' : '🏢 Company'}
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
                <span className="block text-xs font-semibold text-gray-700 mb-1">Profile Picture (Optional)</span>
                <div className="flex items-center gap-2">
                  <label className="bg-white hover:bg-purple-50 hover:text-purple-605 text-gray-600 text-[11px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-gray-200 flex items-center gap-1.5">
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

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                <input type="text" required value={form.firstName} onChange={(e) => update('firstName', e.target.value)}
                  placeholder="James" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                <input type="text" required value={form.lastName} onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Miller" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
                  placeholder="james@agency.com" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  placeholder="+1 555 000 0000" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Personal fields */}
            {agentType === 'personal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)}
                  placeholder="London" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}

            {/* Company fields */}
            {agentType === 'company' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                  <input type="text" required={agentType === 'company'} value={form.companyName} onChange={(e) => update('companyName', e.target.value)}
                    placeholder="Ahmadi Consulting" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Location <span className="text-red-500">*</span></label>
                  <input type="text" required={agentType === 'company'} value={form.companyLocation} onChange={(e) => update('companyLocation', e.target.value)}
                    placeholder="Paris, France" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            )}

            {/* Document upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {agentType === 'personal' ? 'CNI / National ID Document' : 'Company Registration Certificate'}
                <span className="text-red-500"> *</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                {agentType === 'personal'
                  ? 'Upload a clear scan of your national identity card (both sides if applicable).'
                  : 'Upload your official business registration certificate.'}
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
                  <span className="text-sm text-gray-500">Click to upload or drag & drop</span>
                  <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max 5MB</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)}
                    placeholder="Min. 6 characters" minLength={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                <input type="password" required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#1a3a6b] hover:bg-[#163060] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-colors">
              {loading ? 'Submitting…' : 'Submit for Verification'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account? <a href="/login" className="text-blue-600 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
