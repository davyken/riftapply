'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Building2, Upload, X } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';

export default function UniversityRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', city: '', district: '', address: '', website: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k !== 'confirmPassword' && v) data.append(k, v);
    });
    if (logoFile) data.append('logo', logoFile);

    setLoading(true);
    try {
      await authApi.registerUniversity(data);
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
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Building2 size={28} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Registration Submitted!</h2>
          <p className="text-sm text-gray-500 text-center mb-7">
            Your university account is under review. Here's what happens next:
          </p>

          <div className="space-y-4 mb-7">
            {[
              {
                n: 1,
                title: 'Admin reviews your registration',
                desc: 'Our team verifies your institution details. This typically takes between 15 and 30 minutes during business hours.',
                icon: '🔍',
                tag: null,
              },
              {
                n: 2,
                title: 'Log in with your credentials',
                desc: 'Once approved, your account becomes active. Try logging in after 15–30 minutes. If rejected, the reason will appear on your dashboard.',
                icon: '🔑',
                tag: null,
              },
              {
                n: 3,
                title: 'Complete your profile',
                desc: 'Go to My Profile and add your modules and programs. This step is required before students and agents can apply to your institution.',
                icon: '📋',
                tag: 'Required',
              },
              {
                n: 4,
                title: 'Start receiving applications',
                desc: 'Once your profile is complete and programs are listed, applications forwarded by the riftApply team will appear in your Applications inbox.',
                icon: '🎓',
                tag: null,
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a3a6b] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step.n}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{step.icon} {step.title}</p>
                    {step.tag && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">{step.tag}</span>
                    )}
                  </div>
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
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">University Account</h1>
          <p className="text-green-100 text-sm leading-relaxed max-w-xs">
            Register your institution, list your programs with fees, and receive pre-screened international applications.
          </p>
          <ul className="mt-6 space-y-2">
            {['Receive verified, pre-screened applications', 'Manage all programs & fees in one place', 'Direct messaging with admin team', 'Analytics on recruitment performance'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-green-100 text-sm">
                <span className="text-green-400">✓</span> {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 bg-green-400/10 border border-green-400/30 rounded-lg px-4 py-3 space-y-1.5">
            <p className="text-green-300 text-xs font-semibold">⏳ Two-step activation</p>
            <p className="text-green-200 text-xs"><span className="font-semibold text-white">Step 1 —</span> Admin approves your account within 15–30 minutes.</p>
            <p className="text-green-200 text-xs"><span className="font-semibold text-white">Step 2 —</span> Log in and complete your profile with modules and programs to start receiving applications.</p>
          </div>
        </div>
        <p className="relative text-green-400 text-xs">Already registered? <a href="/login" className="text-white underline">Sign in here</a></p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Register Your University</h2>
          <p className="text-sm text-gray-500 mb-3">Fill in your institution details and submit for admin review.</p>
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 mb-5">
            <span className="text-blue-500 text-sm mt-0.5">ℹ️</span>
            <p className="text-xs text-blue-700 leading-relaxed">
              After approval (15–30 min), log in and go to <strong>My Profile</strong> to add your programs. Your institution won't appear in search results until programs are set up.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Logo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University Logo</label>
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
                  <span className="text-sm text-gray-600">{logoFile ? logoFile.name : 'Upload logo (PNG, JPG, SVG)'}</span>
                  <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.svg,.webp"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoChange(f); }} />
                </label>
              </div>
            </div>

            {/* University name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University Name <span className="text-red-500">*</span></label>
              <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)}
                placeholder="University of Excellence" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Official Email <span className="text-red-500">*</span></label>
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
                  placeholder="admissions@university.edu" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  placeholder="+44 20 7946 0000" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* City + District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                <input type="text" required value={form.city} onChange={(e) => update('city', e.target.value)}
                  placeholder="London" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District / Area</label>
                <input type="text" value={form.district} onChange={(e) => update('district', e.target.value)}
                  placeholder="South Kensington" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Address + Website */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)}
                  placeholder="Exhibition Road, SW7 2AZ" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" value={form.website} onChange={(e) => update('website', e.target.value)}
                  placeholder="https://www.university.edu" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
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
              {loading ? 'Submitting…' : 'Register University'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already registered? <a href="/login" className="text-blue-600 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
