'use client';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { applicationsApi } from '@/lib/api/applications.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';
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

export default function StudentDashboard() {
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

  const firstName = (user as any)?.firstName || 'there';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="rounded-xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #1e4fa0 100%)' }}>
        <h2 className="text-xl font-bold mb-1">Welcome {firstName}, let's find your future</h2>
        <p className="text-blue-200 text-sm max-w-lg">
          Track your applications and upload your documents to boost your acceptance chances.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => { setLoading(true); setError(''); applicationsApi.getMine().then((r) => setApps(r.data)).catch(() => setError('Failed to load applications.')).finally(() => setLoading(false)); }} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">My Applications</h3>
            <span className="text-xs text-gray-400">{apps.length} total</span>
          </div>
          {loading ? <PageLoader /> : apps.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Start by searching for universities and applying to programs that match your goals."
              action={
                <Link href="/student/search" className="flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#163060]">
                  <Plus size={15} /> Find Universities
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {apps.map((app) => (
                <div key={app._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold bg-[#1a3a6b]">
                    {app.universityName?.slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{app.programName}</p>
                    <p className="text-xs text-gray-500">{app.universityName} · {app.moduleName}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[app.status] ?? app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents shortcut */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">My Documents</h3>
            <p className="text-xs text-gray-400">
              Files you've submitted with your applications are stored here for easy access.
            </p>
          </div>
          <Link href="/student/documents" className="w-full mt-6 flex items-center justify-center gap-2 bg-[#1a3a6b] text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-[#163060] transition-colors">
            View My Documents
          </Link>
        </div>
      </div>

      {/* FAB */}
      <Link href="/student/search" className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-[#163060] z-10">
        <Plus size={16} /> Start New Application
      </Link>
    </div>
  );
}
