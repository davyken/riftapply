'use client';
import { useEffect, useState, useCallback } from 'react';
import { Search, CheckCircle, XCircle, Send, Bell, Eye, CheckCheck, X } from 'lucide-react';
import { adminApi } from '@/lib/api/admin.api';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';
import type { Application } from '@/types';

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  pending_review:         { label: 'Pending Review',  badge: 'bg-yellow-100 text-yellow-700' },
  approved:               { label: 'Approved',         badge: 'bg-blue-100 text-blue-700' },
  rejected:               { label: 'Rejected',         badge: 'bg-red-100 text-red-600' },
  sent_to_university:     { label: 'Sent to Uni',      badge: 'bg-purple-100 text-purple-700' },
  accepted_by_university: { label: 'Accepted',         badge: 'bg-green-100 text-green-700' },
  refused_by_university:  { label: 'Refused by Uni',   badge: 'bg-red-100 text-red-600' },
  info_requested:         { label: 'Info Required',    badge: 'bg-orange-100 text-orange-700' },
};

const FILTERS = ['all', 'pending_review', 'approved', 'sent_to_university', 'accepted_by_university', 'rejected'] as const;
const FILTER_LABELS: Record<typeof FILTERS[number], string> = {
  all: 'All', pending_review: 'Pending', approved: 'Approved',
  sent_to_university: 'Sent', accepted_by_university: 'Accepted', rejected: 'Rejected',
};

export default function AdminApplicationsPage() {
  const [apps,         setApps]         = useState<Application[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [query,        setQuery]        = useState('');
  const [filter,       setFilter]       = useState<typeof FILTERS[number]>('all');
  const [acting,       setActing]       = useState<string | null>(null);
  const [notified,     setNotified]     = useState<Set<string>>(new Set());
  // inline reject form: appId → reason string (null = hidden)
  const [rejectingId,  setRejectingId]  = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await adminApi.getApplications();
      setApps(res.data);
    } catch { setError('Failed to load applications.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function act(id: string, fn: () => Promise<any>, onDone?: () => void) {
    setActing(id);
    try { await fn(); onDone?.(); await load(); }
    catch { /* silently fail */ }
    finally { setActing(null); }
  }

  async function notifyCandidate(id: string) {
    await act(id, () => adminApi.notifyCandidate(id, { sendEmail: false, sendDashboard: true }), () => {
      setNotified((prev) => new Set(prev).add(id));
    });
  }

  async function confirmReject(id: string) {
    if (!rejectReason.trim()) return;
    await act(id, () => adminApi.rejectApplication(id, rejectReason.trim()));
    setRejectingId(null);
    setRejectReason('');
  }

  const displayed = apps.filter((a) => {
    const q = query.toLowerCase();
    const matchQ = !q || a.applicantName.toLowerCase().includes(q) || a.universityName?.toLowerCase().includes(q);
    const matchF = filter === 'all' || a.status === filter;
    return matchQ && matchF;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review, approve, reject, and forward applications to universities.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Total',    count: apps.length,                                                           color: 'text-gray-900' },
            { label: 'Pending',  count: apps.filter((a) => a.status === 'pending_review').length,             color: 'text-yellow-600' },
            { label: 'Approved', count: apps.filter((a) => a.status === 'approved').length,                   color: 'text-blue-600' },
            { label: 'Sent',     count: apps.filter((a) => a.status === 'sent_to_university').length,         color: 'text-purple-600' },
            { label: 'Accepted', count: apps.filter((a) => a.status === 'accepted_by_university').length,     color: 'text-green-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or university…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${filter === f ? 'bg-[#1a3a6b] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {loading ? <PageLoader /> : displayed.length === 0 ? (
          <EmptyState title="No applications found" description="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-5 py-3">Applicant</th>
                <th className="text-left px-5 py-3">University</th>
                <th className="text-left px-5 py-3">Program / Module</th>
                <th className="text-left px-5 py-3">Documents</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayed.map((app) => {
                const cfg = STATUS_CONFIG[app.status] ?? { label: app.status, badge: 'bg-gray-100 text-gray-600' };
                const busy = acting === app._id;
                const isRejecting = rejectingId === app._id;

                return (
                  <tr key={app._id} className="hover:bg-gray-50 align-top">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1a3a6b] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {app.applicantName?.split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{app.applicantName}</p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${app.applicantType === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{app.applicantType}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{app.universityName}</td>
                    <td className="px-5 py-3.5 text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">{app.programName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{app.moduleName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {app.documents && app.documents.length > 0 ? (
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          {app.documents.map((doc, dIdx) => (
                            <a key={dIdx} href={doc.url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline truncate flex items-center gap-1 font-semibold"
                              title={doc.name}>
                              <Eye size={12} className="flex-shrink-0 text-blue-400" />
                              <span className="truncate">{doc.name.replace(/_/g, ' ')}</span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No files</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                      {app.rejectionReason && (
                        <p className="text-[10px] text-red-500 mt-1 max-w-[140px] truncate" title={app.rejectionReason}>
                          {app.rejectionReason}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {/* Inline reject form */}
                      {isRejecting ? (
                        <div className="space-y-1.5 min-w-[220px]">
                          <textarea
                            rows={2}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection…"
                            className="w-full px-2 py-1.5 text-xs border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <button
                              disabled={busy || !rejectReason.trim()}
                              onClick={() => confirmReject(app._id)}
                              className="flex-1 text-xs bg-red-600 text-white font-semibold px-2 py-1.5 rounded-lg disabled:opacity-50 hover:bg-red-700 transition-colors"
                            >
                              {busy ? 'Rejecting…' : 'Confirm Reject'}
                            </button>
                            <button
                              onClick={() => { setRejectingId(null); setRejectReason(''); }}
                              className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 flex-wrap">
                          {app.status === 'pending_review' && (
                            <>
                              <button disabled={busy} onClick={() => act(app._id, () => adminApi.approveApplication(app._id))}
                                className="flex items-center gap-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 font-semibold px-2 py-1 rounded disabled:opacity-50">
                                <CheckCircle size={11} /> Approve
                              </button>
                              <button disabled={busy} onClick={() => { setRejectingId(app._id); setRejectReason(''); }}
                                className="flex items-center gap-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-2 py-1 rounded disabled:opacity-50">
                                <XCircle size={11} /> Reject
                              </button>
                            </>
                          )}
                          {app.status === 'approved' && (
                            <button disabled={busy} onClick={() => act(app._id, () => adminApi.sendToUniversity(app._id))}
                              className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold px-2 py-1 rounded disabled:opacity-50 min-w-[120px] justify-center">
                              {busy
                                ? <><span className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin flex-shrink-0" /><span>Sending…</span></>
                                : <><Send size={11} /><span>Send to University</span></>}
                            </button>
                          )}
                          {(app.status === 'accepted_by_university' || app.status === 'refused_by_university') && (
                            notified.has(app._id) || app.candidateNotifiedAt ? (
                              <span className="flex items-center gap-1 text-xs text-green-600 font-semibold px-2 py-1">
                                <CheckCheck size={12} /> Notified
                              </span>
                            ) : (
                              <button disabled={busy} onClick={() => notifyCandidate(app._id)}
                                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded disabled:opacity-50 ${
                                  app.status === 'accepted_by_university'
                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}>
                                <Bell size={11} />
                                {app.status === 'accepted_by_university' ? 'Notify — Accepted' : 'Notify — Refused'}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
        {!loading && (
          <div className="px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Showing {displayed.length} of {apps.length} applications</p>
          </div>
        )}
      </div>
    </div>
  );
}
