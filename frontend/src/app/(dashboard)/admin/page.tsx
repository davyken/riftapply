'use client';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, XCircle, Clock, Send, Bell, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { adminApi } from '@/lib/api/admin.api';
import { PageLoader, ErrorBanner } from '@/components/ui/PageLoader';
import BarChartWidget from '@/components/ui/BarChartWidget';
import type { AdminStats, Application } from '@/types';

const STATUS_STYLE: Record<string, string> = {
  pending_review:         'bg-yellow-100 text-yellow-700',
  approved:               'bg-blue-100 text-blue-700',
  rejected:               'bg-red-100 text-red-700',
  sent_to_university:     'bg-purple-100 text-purple-700',
  accepted_by_university: 'bg-green-100 text-green-700',
  refused_by_university:  'bg-red-100 text-red-700',
  info_requested:         'bg-orange-100 text-orange-700',
};
const STATUS_LABEL: Record<string, string> = {
  pending_review: 'Pending', approved: 'Approved', rejected: 'Rejected',
  sent_to_university: 'Sent to Uni', accepted_by_university: 'Accepted',
  refused_by_university: 'Refused', info_requested: 'Info Req.',
};

export default function AdminDashboard() {
  const [stats,        setStats]        = useState<AdminStats | null>(null);
  const [pendingAgents, setPendingAgents] = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [replies,      setReplies]      = useState<Application[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [notified,     setNotified]     = useState<Set<string>>(new Set());
  const [sending,      setSending]      = useState<string | null>(null);

  async function load() {
    setLoading(true); setError('');
    try {
      const [s, a, apps, r] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPendingAgents(),
        adminApi.getApplications(),
        adminApi.getUniversityReplies(),
      ]);
      setStats(s.data);
      setPendingAgents(a.data.slice(0, 3));
      setApplications(apps.data.slice(0, 5));
      setReplies(r.data.slice(0, 3));
    } catch { setError('Failed to load dashboard data.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <PageLoader />;
  if (error)   return <div className="p-6"><ErrorBanner message={error} onRetry={load} /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Central control for all applications, accounts, and communications.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Students',  value: stats?.students ?? 0,                                  icon: <CheckCircle size={18} className="text-blue-500" />,   bg: 'bg-blue-50'   },
          { label: 'Agents',          value: stats?.agents.total ?? 0,     sub: `${stats?.agents.pending ?? 0} pending`,       icon: <Clock size={18} className="text-yellow-500" />, bg: 'bg-yellow-50' },
          { label: 'Universities',    value: stats?.universities.total ?? 0, sub: `${stats?.universities.pending ?? 0} pending`, icon: <CheckCircle size={18} className="text-green-500" />, bg: 'bg-green-50' },
          { label: 'Awaiting Notify', value: stats?.universityRepliesAwaitingAction ?? 0,            icon: <Bell size={18} className="text-purple-500" />,         bg: 'bg-purple-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</p>
            {stat.sub && <p className="text-xs text-yellow-600 font-medium mt-0.5">{stat.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending Verifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Pending Verifications</h3>
          <p className="text-xs text-gray-400 mb-4">Account documents to review</p>
          {pendingAgents.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">No pending verifications.</p>
          ) : (
            <div className="space-y-3">
              {pendingAgents.map((a) => (
                <div key={a._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">Agent</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{a.firstName} {a.lastName}</p>
                  <p className="text-xs text-gray-500">{a.agentType === 'company' ? a.companyName : a.city}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => adminApi.approveAgent(a._id).then(load)} className="flex items-center gap-1 text-xs text-green-700 bg-green-50 hover:bg-green-100 px-2 py-1 rounded font-medium">
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button onClick={() => adminApi.rejectAgent(a._id, 'Rejected by admin').then(load)} className="flex items-center gap-1 text-xs text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded font-medium">
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/agents" className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:underline font-medium mt-3">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {/* Applications Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Applications Queue</h3>
            <Link href="/admin/applications" className="text-sm text-blue-600 hover:underline font-medium">View all →</Link>
          </div>
          {applications.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No applications yet.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left pb-3">Applicant</th>
                  <th className="text-left pb-3">University</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-left pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1a3a6b] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {app.applicantName?.split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{app.applicantName}</p>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600 truncate max-w-[160px]">{app.universityName}</td>
                    <td className="py-3">
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded ${STATUS_STYLE[app.status]}`}>
                        {STATUS_LABEL[app.status] ?? app.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {app.status === 'pending_review' && (
                        <div className="flex gap-1">
                          <button onClick={() => adminApi.approveApplication(app._id).then(load)} className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2 py-1 rounded font-medium">Approve</button>
                          <button onClick={() => adminApi.rejectApplication(app._id, 'Rejected').then(load)} className="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-2 py-1 rounded font-medium">Reject</button>
                        </div>
                      )}
                      {app.status === 'approved' && (
                        <button
                          disabled={sending === app._id}
                          onClick={async () => {
                            setSending(app._id);
                            try { await adminApi.sendToUniversity(app._id); await load(); }
                            finally { setSending(null); }
                          }}
                          className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 px-2 py-1 rounded font-medium disabled:opacity-50"
                        >
                          {sending === app._id
                            ? <><span className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" /><span>Sending…</span></>
                            : <><Send size={11} /><span>Send</span></>}
                        </button>
                      )}
                      {(app.status === 'accepted_by_university' || app.status === 'refused_by_university') && (
                        notified.has(app._id) || app.candidateNotifiedAt ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCheck size={11} /> Notified</span>
                        ) : (
                          <button
                            onClick={() => adminApi.notifyCandidate(app._id, { sendEmail: true, sendDashboard: true }).then(() => { setNotified(p => new Set(p).add(app._id)); load(); })}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded font-medium ${app.status === 'accepted_by_university' ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                          >
                            <Bell size={11} /> Notify
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      {/* University Replies */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">University Replies Awaiting Action</h3>
          <Link href="/admin/applications" className="text-sm text-blue-600 hover:underline font-medium">View all →</Link>
        </div>
        {replies.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No pending university replies.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {replies.map((r) => (
              <div key={r._id} className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold text-gray-900">{r.applicantName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.universityName}</p>
                <span className={`mt-2 inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${STATUS_STYLE[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
                {notified.has(r._id) || r.candidateNotifiedAt ? (
                  <div className="w-full mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-green-600 py-1">
                    <CheckCheck size={12} /> Candidate Notified
                  </div>
                ) : (
                  <button
                    onClick={() => adminApi.notifyCandidate(r._id, { sendEmail: true, sendDashboard: true }).then(() => { setNotified(p => new Set(p).add(r._id)); load(); })}
                    className="w-full mt-3 flex items-center justify-center gap-1 text-xs font-semibold bg-[#1a3a6b] text-white py-2 rounded-lg hover:bg-[#163060]"
                  >
                    <Bell size={12} /> Notify Candidate
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
