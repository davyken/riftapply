'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  Search, CheckCircle, XCircle, Building2, User, Trash2,
  ChevronDown, ChevronUp, Mail, Phone, MapPin, Calendar, ShieldCheck,
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin.api';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';

type AgentStatus = 'pending' | 'active' | 'rejected';

const STATUS_BADGE: Record<AgentStatus, string> = {
  pending:  'bg-yellow-100 text-yellow-700',
  active:   'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

const TAB_STATUSES: AgentStatus[] = ['pending', 'active', 'rejected'];

interface DeleteModal { id: string; name: string }

export default function AdminAgentsPage() {
  const [agents,      setAgents]      = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [tab,         setTab]         = useState<AgentStatus>('pending');
  const [query,       setQuery]       = useState('');
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [rejectNote,  setRejectNote]  = useState<Record<string, string>>({});
  const [acting,      setActing]      = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModal | null>(null);
  const [deleting,    setDeleting]    = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const res = await adminApi.getAllAgents(); setAgents(res.data); }
    catch { setError('Failed to load agents.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function approve(id: string) {
    setActing(id);
    try { await adminApi.approveAgent(id); await load(); }
    catch {} finally { setActing(null); }
  }

  async function reject(id: string) {
    setActing(id);
    try { await adminApi.rejectAgent(id, rejectNote[id] || 'Rejected by admin'); await load(); setExpanded(null); }
    catch {} finally { setActing(null); }
  }

  async function confirmDelete() {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await adminApi.deleteAgent(deleteModal.id);
      setDeleteModal(null);
      await load();
    } catch { setError('Failed to delete agent.'); }
    finally { setDeleting(false); }
  }

  const byTab   = agents.filter((a) => a.status === tab);
  const filtered = byTab.filter((a) => {
    const q = query.toLowerCase();
    return !q || a.firstName?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || (a.companyName || '').toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center">Delete Agent?</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              <strong>{deleteModal.name}</strong> will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agents Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review, manage, and delete agent accounts.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TAB_STATUSES.map((s) => (
            <button key={s} onClick={() => setTab(s)}
              className={`bg-white rounded-xl border p-4 text-left transition-all ${tab === s ? 'border-[#1a3a6b] ring-1 ring-[#1a3a6b]/20' : 'border-gray-200 hover:border-gray-300'}`}>
              <p className="text-2xl font-bold text-gray-900">{agents.filter((a) => a.status === s).length}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize mt-1 inline-block ${STATUS_BADGE[s]}`}>{s}</span>
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 flex-wrap">
          <div className="flex gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
            {TAB_STATUSES.map((s) => (
              <button key={s} onClick={() => setTab(s)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${tab === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {loading ? <PageLoader /> : filtered.length === 0 ? (
          <EmptyState title={`No ${tab} agents`} description="Nothing to show for this filter." />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((agent) => {
              const open = expanded === agent._id;
              const busy = acting === agent._id;
              const isRejectPanel = open && agent.status === 'pending';
              return (
                <div key={agent._id}>
                  <div className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-[#1a3a6b] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {agent.firstName?.[0]}{agent.lastName?.[0]}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-gray-900">{agent.firstName} {agent.lastName}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-0.5 ${agent.agentType === 'company' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {agent.agentType === 'company' ? <><Building2 size={10} /> Company</> : <><User size={10} /> Personal</>}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${STATUS_BADGE[agent.status as AgentStatus]}`}>{agent.status}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Mail size={11} />{agent.email}</span>
                        {agent.phone && <span className="text-xs text-gray-400 flex items-center gap-1"><Phone size={11} />{agent.phone}</span>}
                      </div>
                      {agent.companyName && <p className="text-xs text-gray-400 mt-0.5">{agent.companyName} {agent.companyLocation ? `· ${agent.companyLocation}` : ''}</p>}
                      {agent.status === 'rejected' && agent.rejectionReason && (
                        <p className="text-xs text-red-500 mt-1 bg-red-50 rounded px-2 py-1">{agent.rejectionReason}</p>
                      )}
                      <p className="text-[11px] text-gray-300 mt-0.5">Registered {new Date(agent.createdAt).toLocaleDateString()}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {agent.status === 'pending' && (
                        <>
                          <button disabled={busy} onClick={() => approve(agent._id)}
                            className="flex items-center gap-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50">
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button disabled={busy} onClick={() => setExpanded(open ? null : agent._id)}
                            className="flex items-center gap-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-3 py-1.5 rounded-lg">
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setExpanded(open && !isRejectPanel ? null : agent._id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View details"
                      >
                        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                      <button
                        onClick={() => setDeleteModal({ id: agent._id, name: `${agent.firstName} ${agent.lastName}` })}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete agent"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded panel */}
                  {open && (
                    <div className="px-5 pb-5 pt-3 bg-gray-50 border-t border-gray-100">
                      {agent.status === 'pending' ? (
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">Rejection reason:</label>
                          <textarea rows={2} value={rejectNote[agent._id] || ''} onChange={(e) => setRejectNote((p) => ({ ...p, [agent._id]: e.target.value }))}
                            placeholder="Explain why this agent is being rejected…"
                            className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 resize-none bg-white" />
                          <button disabled={busy} onClick={() => reject(agent._id)}
                            className="mt-2 text-xs bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50">
                            Confirm Rejection
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <DetailCell icon={<Mail size={12} />} label="Email" value={agent.email} />
                          <DetailCell icon={<Phone size={12} />} label="Phone" value={agent.phone || '—'} />
                          <DetailCell icon={<MapPin size={12} />} label="City" value={agent.city || '—'} />
                          <DetailCell icon={<Building2 size={12} />} label="Agent Type" value={agent.agentType === 'company' ? 'Company' : 'Personal'} />
                          {agent.companyName && <DetailCell icon={<Building2 size={12} />} label="Company" value={agent.companyName} />}
                          {agent.companyLocation && <DetailCell icon={<MapPin size={12} />} label="Location" value={agent.companyLocation} />}
                          <DetailCell icon={<ShieldCheck size={12} />} label="Verified" value={agent.isVerified ? 'Yes' : 'No'} />
                          <DetailCell icon={<Calendar size={12} />} label="Registered" value={new Date(agent.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
                          {agent.rejectionReason && (
                            <div className="col-span-full">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Rejection Reason</p>
                              <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-1.5">{agent.rejectionReason}</p>
                            </div>
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

        {!loading && filtered.length > 0 && (
          <div className="px-5 py-2.5 border-t border-gray-100">
            <p className="text-xs text-gray-400">{filtered.length} agent{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 px-3 py-2.5">
      <div className="flex items-center gap-1 text-gray-400 mb-0.5">{icon}<span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span></div>
      <p className="text-xs font-semibold text-gray-800 truncate">{value}</p>
    </div>
  );
}
