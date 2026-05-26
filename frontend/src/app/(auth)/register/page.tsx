'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, User, Briefcase, Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useT } from '@/lib/i18n/useT';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function RegisterRolePage() {
  const router = useRouter();
  const { T, t } = useT();

  const roles = [
    {
      key: 'student',
      label: T(t.register.studentTitle),
      description: T(t.register.studentDesc),
      icon: <User size={28} />,
      color: 'bg-blue-50 text-blue-600',
      border: 'hover:border-blue-400',
      href: '/register/student',
      badge: null,
    },
    {
      key: 'agent',
      label: T(t.register.agentTitle),
      description: T(t.register.agentDesc),
      icon: <Briefcase size={28} />,
      color: 'bg-purple-50 text-purple-600',
      border: 'hover:border-purple-400',
      href: '/register/agent',
      badge: { text: T(t.register.agentBadge), color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    },
    {
      key: 'university',
      label: T(t.register.universityTitle),
      description: T(t.register.universityDesc),
      icon: <Building2 size={28} />,
      color: 'bg-green-50 text-green-600',
      border: 'hover:border-green-400',
      href: '/register/university',
      badge: { text: T(t.register.universityBadge), color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[44%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2544 0%, #1a3a6b 40%, #1e4080 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.05) 60px,rgba(255,255,255,.05) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.05) 60px,rgba(255,255,255,.05) 61px)`,
          }}
        />
        <div className="relative flex items-center gap-2 text-white">
          <div className="w-9 h-9 bg-blue-400 rounded-lg flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">riftApply</span>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            {T(t.register.leftTitle)}
          </h1>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            {T(t.register.leftSubtitle)}
          </p>
          <div className="mt-8 space-y-3">
            {[T(t.register.leftFeature1), T(t.register.leftFeature2), T(t.register.leftFeature3)].map((item) => (
              <div key={item} className="flex items-center gap-3 text-blue-100 text-sm">
                <div className="w-5 h-5 rounded-full bg-blue-400/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-300" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative bg-white/10 rounded-xl p-5 border border-white/10">
          <p className="text-blue-100 text-sm italic">{T(t.register.leftTestimonial)}</p>
          <p className="text-blue-300 text-xs mt-2 font-medium">{T(t.register.leftTestimonialAuthor)}</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 bg-[#1a3a6b] rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[#1a3a6b]">riftApply</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft size={16} /> {T(t.nav.backToHome)}
            </Link>
            <LanguageToggle />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">{T(t.register.title)}</h2>
          <p className="text-sm text-gray-500 mb-8">{T(t.register.subtitle)}</p>

          <div className="space-y-3">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => router.push(role.href)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 border-gray-100 ${role.border} transition-all group text-left`}
              >
                <div className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {role.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{role.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{role.description}</p>
                  {role.badge && (
                    <span className={`inline-flex items-center gap-1 mt-2 text-[11px] font-semibold px-2 py-0.5 rounded border ${role.badge.color}`}>
                      ⏳ {role.badge.text}
                    </span>
                  )}
                </div>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors mt-1" />
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            {T(t.register.alreadyHave)}{' '}
            <a href="/login" className="text-blue-600 font-medium hover:underline">{T(t.register.signIn)}</a>
          </p>

          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
            <a href="/privacy-policy" className="hover:text-gray-600">{T(t.common.privacy)}</a>
            <a href="/terms-of-service" className="hover:text-gray-600">{T(t.common.terms)}</a>
            <a href="/help" className="hover:text-gray-600">{T(t.common.help)}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
