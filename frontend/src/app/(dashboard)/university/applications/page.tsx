'use client';
import { useEffect, useState, useCallback } from 'react';
import { Search, CheckCircle, XCircle, MessageSquare, FileText, ExternalLink, ChevronDown, ChevronUp, User, Mail, Phone } from 'lucide-react';
import { applicationsApi } from '@/lib/api/applications.api';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';
import type { Application } from '@/types';

type DisplayDecision = 'pending' | 'accepted' | 'refused' | 'info_requested';

function getDecision(app: Application): DisplayDecision {
  if (app.status === 'accepted_by_university') return 'accepted';
  if (app.status === 'refused_by_university') return 'refused';
  if (app.universityDecision === 'info_requested') return 'info_requested';
  return 'pending';
}

const DECISION_CONFIG: Record<DisplayDecision, { label: string; badge: string }> = {
  pending:        { label: 'Awaiting Decision', badge: 'bg-yellow-100 text-yellow-700' },
  accepted:       { label: 'Accepted',           badge: 'bg-green-100 text-green-700' },
  refused:        { label: 'Refused',            badge: 'bg-red-100 text-red-600' },
  info_requested: { label: 'Info Requested',     badge: 'bg-orange-100 text-orange-700' },
};

export default function UniversityApplicationsPage() {
  const [apps,     setApps]     = useState<Application[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [query,    setQuery]    = useState('');
  const [filter,   setFilter]   = useState<DisplayDecision | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes,    setNotes]    = useState<Record<string, string>>({});
  const [acting,   setActing]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const res = await applicationsApi.getUniversityApplications(); setApps(res.data); }
    catch { setError('Failed to load applications.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function respond(id: string, decision: 'accepted' | 'refused' | 'info_requested') {
    setActing(id);
    try {
      await applicationsApi.universityRespond(id, { decision, response: notes[id] ?? '' });
      await load();
      setExpanded(null);
    } catch {}
    finally { setActing(null); }
  }

  const filtered = apps.filter((a) => {
    const q = query.toLowerCase();
    const matchQ = !q || a.applicantName?.toLowerCase().includes(q) || a.programName?.toLowerCase().includes(q);
    const matchF = filter === 'all' || getDecision(a) === filter;
    return matchQ && matchF;
  });

  const total    = apps.length;
  const pending  = apps.filter((a) => getDecision(a) === 'pending').length;
  const accepted = apps.filter((a) => getDecision(a) === 'accepted').length;
  const refused  = apps.filter((a) => getDecision(a) === 'refused').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications Inbox</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review student documents and respond to applications forwarded by the admissions team.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Received',    count: total,    color: 'text-gray-900' },
            { label: 'Awaiting Decision', count: pending,  color: 'text-yellow-600' },
            { label: 'Accepted',          count: accepted, color: 'text-green-600' },
            { label: 'Refused',           count: refused,  color: 'text-red-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search applicant or program…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {(['all', 'pending', 'accepted', 'refused', 'info_requested'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${filter === f ? 'bg-[#1a3a6b] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f === 'info_requested' ? 'Info Req.' : f}
              </button>
            ))}
          </div>
        </div>

        {loading ? <PageLoader /> : filtered.length === 0 ? (
          <EmptyState icon={<FileText size={32} />}
            title={apps.length === 0 ? 'No applications yet' : 'No matching applications'}
            description={apps.length === 0 ? 'Applications forwarded to your institution will appear here.' : 'Try a different filter or search term.'} />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((app) => {
              const decision = getDecision(app);
              const cfg = DECISION_CONFIG[decision];
              const open = expanded === app._id;
              const busy = acting === app._id;

              return (
                <div key={app._id}>
                  {/* Row */}
                  <button
                    onClick={() => setExpanded(open ? null : app._id)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#1a3a6b] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {app.applicantName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{app.applicantName}</p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${app.applicantType === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {app.applicantType}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{app.programName} · {app.moduleName}</p>
                      <p className="text-[11px] text-gray-300 mt-0.5">{new Date(app.createdAt).toLocaleDateString()} · {app._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                    {open ? <ChevronUp size={15} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />}
                  </button>

                  {/* Expanded panel */}
                  {open && (
                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 space-y-5">

                      {/* Applicant info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <User size={13} className="text-gray-400 flex-shrink-0" />
                          <span>{app.applicantName}</span>
                        </div>
                        {app.applicantEmail && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail size={13} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{app.applicantEmail}</span>
                          </div>
                        )}
                        {app.applicantPhone && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone size={13} className="text-gray-400 flex-shrink-0" />
                            <span>{app.applicantPhone}</span>
                          </div>
                        )}
                      </div>

                      {/* Documents */}
                      {app.documents && app.documents.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Submitted Documents</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {app.documents.map((doc, i) => (
                              <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors font-medium group">
                                <FileText size={13} className="text-blue-400 flex-shrink-0" />
                                <span className="truncate flex-1">{doc.name.replace(/_/g, ' ')}</span>
                                <ExternalLink size={11} className="text-blue-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Decision area */}
                      {decision === 'pending' ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                              Message to applicant <span className="text-gray-400 font-normal">(optional for acceptance, required for refusal or info request)</span>
                            </label>
                            <textarea rows={3} value={notes[app._id] || ''}
                              onChange={(e) => setNotes((p) => ({ ...p, [app._id]: e.target.value }))}
                              placeholder="Add a message or reason for your decision…"
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white" />
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button disabled={busy} onClick={() => respond(app._id, 'accepted')}
                              className="flex items-center gap-1.5 text-sm bg-green-600 text-white hover:bg-green-700 font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                              <CheckCircle size={14} /> Accept Application
                            </button>
                            <button disabled={busy || !notes[app._id]?.trim()} onClick={() => respond(app._id, 'refused')}
                              className="flex items-center gap-1.5 text-sm bg-red-600 text-white hover:bg-red-700 font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                              <XCircle size={14} /> Refuse Application
                            </button>
                            <button disabled={busy || !notes[app._id]?.trim()} onClick={() => respond(app._id, 'info_requested')}
                              className="flex items-center gap-1.5 text-sm bg-orange-500 text-white hover:bg-orange-600 font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                              <MessageSquare size={14} /> Request More Info
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-400">Refuse and Info Request require a message.</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Response</p>
                          {app.universityResponse ? (
                            <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 italic">"{app.universityResponse}"</p>
                          ) : (
                            <p className="text-xs text-gray-400 italic">No message provided.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
