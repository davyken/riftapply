'use client';
import { useEffect, useState } from 'react';
import { FileText, CheckCircle, Clock, XCircle, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { applicationsApi } from '@/lib/api/applications.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';
import type { Application, University } from '@/types';

const DECISION_FROM_STATUS = (status: string): 'pending' | 'accepted' | 'refused' | 'other' => {
  if (status === 'sent_to_university' || status === 'awaiting_university_response') return 'pending';
  if (status === 'accepted_by_university') return 'accepted';
  if (status === 'refused_by_university') return 'refused';
  return 'other';
};

export default function UniversityDashboard() {
  const { user } = useAuthStore();
  const uni = user as University | null;
  const [apps,    setApps]    = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    applicationsApi.getUniversityApplications()
      .then((r) => setApps(r.data))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  const total    = apps.length;
  const pending  = apps.filter((a) => DECISION_FROM_STATUS(a.status) === 'pending').length;
  const accepted = apps.filter((a) => DECISION_FROM_STATUS(a.status) === 'accepted').length;
  const refused  = apps.filter((a) => DECISION_FROM_STATUS(a.status) === 'refused').length;
  const recent   = apps.slice(0, 5);

  const totalPrograms = uni?.modules?.reduce((s, m) => s + (m.programs?.length ?? 0), 0) ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="rounded-xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #1e4fa0 100%)' }}>
        <h2 className="text-xl font-bold mb-1">{uni?.name ?? 'University Dashboard'}</h2>
        <p className="text-blue-200 text-sm">Manage incoming applications and update your programs.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => { setLoading(true); setError(''); applicationsApi.getUniversityApplications().then((r) => setApps(r.data)).catch(() => setError('Failed to load applications.')).finally(() => setLoading(false)); }} />}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Received',     value: total,    icon: <FileText size={18} className="text-blue-500" />,   bg: 'bg-blue-50' },
          { label: 'Awaiting Decision',  value: pending,  icon: <Clock size={18} className="text-yellow-500" />,   bg: 'bg-yellow-50' },
          { label: 'Accepted',           value: accepted, icon: <CheckCircle size={18} className="text-green-500" />, bg: 'bg-green-50' },
          { label: 'Refused',            value: refused,  icon: <XCircle size={18} className="text-red-500" />,     bg: 'bg-red-50' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>{k.icon}</div>
            {loading ? <div className="h-8 w-12 bg-gray-100 rounded animate-pulse mb-1" /> : <p className="text-2xl font-bold text-gray-900">{k.value}</p>}
            <p className="text-xs font-medium text-gray-500">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Applications</h3>
            <Link href="/university/applications" className="text-sm text-blue-600 hover:underline font-medium">View all →</Link>
          </div>
          {loading ? <PageLoader /> : apps.length === 0 ? (
            <EmptyState icon={<FileText size={32} />} title="No applications yet" description="Applications forwarded to your institution will appear here." />
          ) : (
            <div className="space-y-2">
              {recent.map((app) => {
                const dec = DECISION_FROM_STATUS(app.status);
                const badge = dec === 'accepted' ? 'bg-green-100 text-green-700' : dec === 'refused' ? 'bg-red-100 text-red-600' : dec === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600';
                return (
                  <div key={app._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[#1a3a6b] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {app.applicantName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{app.applicantName}</p>
                      <p className="text-xs text-gray-500 truncate">{app.programName} · {app.moduleName}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${badge}`}>{dec}</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Programs Catalog</h3>
          {uni?.modules && uni.modules.length > 0 ? (
            <div className="space-y-3">
              {uni.modules.slice(0, 4).map((m) => (
                <div key={m.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.programs?.length ?? 0} programs</p>
                  </div>
                </div>
              ))}
              {uni.modules.length > 4 && <p className="text-xs text-gray-400 text-center">+{uni.modules.length - 4} more modules</p>}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-6">
              <BookOpen size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No programs yet</p>
              <Link href="/university/profile" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Set up your profile →</Link>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>{uni?.modules?.length ?? 0} modules</span>
            <span>{totalPrograms} programs total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
