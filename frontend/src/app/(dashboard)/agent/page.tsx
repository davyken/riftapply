'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { applicationsApi } from '@/lib/api/applications.api';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';
import { useAuthStore } from '@/lib/store/auth.store';
import type { Application } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  pending_review:         'bg-yellow-100 text-yellow-700',
  approved:               'bg-blue-100 text-blue-700',
  rejected:               'bg-red-100 text-red-700',
  sent_to_university:     'bg-purple-100 text-purple-700',
  accepted_by_university: 'bg-green-100 text-green-700',
  refused_by_university:  'bg-red-100 text-red-700',
  info_requested:         'bg-orange-100 text-orange-700',
};
const STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending Review', approved: 'Approved', rejected: 'Rejected',
  sent_to_university: 'Sent to Uni', accepted_by_university: 'Accepted',
  refused_by_university: 'Refused', info_requested: 'Info Required',
};

export default function AgentDashboard() {
  const { user } = useAuthStore();
  const [apps,    setApps]    = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    applicationsApi.getMine()
      .then((r) => setApps(r.data))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  const firstName = (user as any)?.firstName || 'Agent';

  const total    = apps.length;
  const pending  = apps.filter((a) => a.status === 'pending_review').length;
  const accepted = apps.filter((a) => a.status === 'accepted_by_university').length;
  const rejected = apps.filter((a) => ['rejected', 'refused_by_university'].includes(a.status)).length;
  const recent   = apps.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="rounded-xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #1e4fa0 100%)' }}>
        <h2 className="text-xl font-bold mb-1">Welcome back, {firstName}</h2>
        <p className="text-blue-200 text-sm">Track your submitted applications and manage your student portfolio.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => { setLoading(true); setError(''); applicationsApi.getMine().then((r) => setApps(r.data)).catch(() => setError('Failed to load applications.')).finally(() => setLoading(false)); }} />}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: total,    icon: <FileText size={18} className="text-blue-500" />,   bg: 'bg-blue-50' },
          { label: 'Pending Review',     value: pending,  icon: <Clock size={18} className="text-yellow-500" />,   bg: 'bg-yellow-50' },
          { label: 'Accepted',           value: accepted, icon: <CheckCircle size={18} className="text-green-500" />, bg: 'bg-green-50' },
          { label: 'Rejected',           value: rejected, icon: <XCircle size={18} className="text-red-500" />,     bg: 'bg-red-50' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>{k.icon}</div>
            {loading ? <div className="h-8 w-12 bg-gray-100 rounded animate-pulse mb-1" /> : <p className="text-2xl font-bold text-gray-900">{k.value}</p>}
            <p className="text-xs font-medium text-gray-500">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Applications</h3>
          <Link href="/agent/applications" className="text-sm text-blue-600 hover:underline font-medium">View all →</Link>
        </div>
        {loading ? <PageLoader /> : apps.length === 0 ? (
          <EmptyState
            icon={<TrendingUp size={32} />}
            title="No applications yet"
            description="Applications you submit on behalf of students will appear here."
          />
        ) : (
          <div className="space-y-2">
            {recent.map((app) => (
              <div key={app._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-9 h-9 rounded-lg bg-[#1a3a6b] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {app.universityName?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{app.programName}</p>
                  <p className="text-xs text-gray-500">{app.universityName} · {app.moduleName}</p>
                  <p className="text-[11px] text-gray-400">{app.applicantName}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {STATUS_LABELS[app.status] ?? app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
