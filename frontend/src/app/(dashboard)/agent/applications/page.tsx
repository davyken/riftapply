'use client';
import { useEffect, useState, useCallback } from 'react';
import { Search, Eye, Send, Clock, CheckCircle, XCircle, MessageSquare, FileText } from 'lucide-react';
import { applicationsApi } from '@/lib/api/applications.api';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';
import type { Application, ApplicationStatus } from '@/types';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; badge: string; icon: React.ReactNode }> = {
  pending_review:              { label: 'Pending Review',  badge: 'bg-yellow-100 text-yellow-700',  icon: <Clock size={13} /> },
  approved:                    { label: 'Approved',        badge: 'bg-blue-100 text-blue-700',      icon: <CheckCircle size={13} /> },
  rejected:                    { label: 'Rejected',        badge: 'bg-red-100 text-red-600',        icon: <XCircle size={13} /> },
  sent_to_university:          { label: 'Sent to Uni',     badge: 'bg-purple-100 text-purple-700',  icon: <Send size={13} /> },
  awaiting_university_response:{ label: 'Awaiting Uni',   badge: 'bg-indigo-100 text-indigo-700',  icon: <Clock size={13} /> },
  accepted_by_university:      { label: 'Accepted',        badge: 'bg-green-100 text-green-700',    icon: <CheckCircle size={13} /> },
  refused_by_university:       { label: 'Refused',         badge: 'bg-red-100 text-red-600',        icon: <XCircle size={13} /> },
  info_requested:              { label: 'Info Required',   badge: 'bg-orange-100 text-orange-700',  icon: <MessageSquare size={13} /> },
};

const FILTER_OPTIONS: { label: string; value: ApplicationStatus | 'all' }[] = [
  { label: 'All',      value: 'all' },
  { label: 'Pending',  value: 'pending_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Sent',     value: 'sent_to_university' },
  { label: 'Accepted', value: 'accepted_by_university' },
  { label: 'Rejected', value: 'rejected' },
];

export default function AgentApplicationsPage() {
  const [apps,    setApps]    = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [query,   setQuery]   = useState('');
  const [filter,  setFilter]  = useState<ApplicationStatus | 'all'>('all');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const res = await applicationsApi.getMine(); setApps(res.data); }
    catch { setError('Failed to load applications.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = apps.filter((a) => {
    const q = query.toLowerCase();
    const matchQ = !q || a.applicantName?.toLowerCase().includes(q) || a.universityName?.toLowerCase().includes(q) || a.programName?.toLowerCase().includes(q) || a._id.toLowerCase().includes(q);
    const matchF = filter === 'all' || a.status === filter;
    return matchQ && matchF;
  });

  const total    = apps.length;
  const pending  = apps.filter((a) => a.status === 'pending_review').length;
  const accepted = apps.filter((a) => a.status === 'accepted_by_university').length;
  const rejected = apps.filter((a) => ['rejected', 'refused_by_university'].includes(a.status)).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track all applications submitted on behalf of your students.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total',    count: total,    color: 'bg-gray-100 text-gray-700' },
            { label: 'Pending',  count: pending,  color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Accepted', count: accepted, color: 'bg-green-100 text-green-700' },
            { label: 'Rejected', count: rejected, color: 'bg-red-100 text-red-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{s.count}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded mt-1 inline-block ${s.color}`}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student, university, program…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {FILTER_OPTIONS.map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${filter === f.value ? 'bg-[#1a3a6b] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? <PageLoader /> : filtered.length === 0 ? (
          <EmptyState icon={<FileText size={32} />} title={apps.length === 0 ? 'No applications yet' : 'No matching applications'} description={apps.length === 0 ? 'Applications you submit will appear here.' : 'Try a different filter or search term.'} />
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left px-5 py-3">Student</th>
                  <th className="text-left px-5 py-3">University</th>
                  <th className="text-left px-5 py-3">Program</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => {
                  const cfg = STATUS_CONFIG[app.status] ?? { label: app.status, badge: 'bg-gray-100 text-gray-600', icon: null };
                  return (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#1a3a6b] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                            {app.applicantName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{app.applicantName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{app.universityName}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{app.programName}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                          {cfg.icon}{cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors p-1" title="View">
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Showing {filtered.length} of {total} applications</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
