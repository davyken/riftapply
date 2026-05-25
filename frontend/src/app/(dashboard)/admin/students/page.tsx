'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  Search, Trash2, ChevronDown, ChevronUp,
  Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap,
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin.api';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';

interface DeleteModal { id: string; name: string }

export default function AdminStudentsPage() {
  const [students,    setStudents]    = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [query,       setQuery]       = useState('');
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModal | null>(null);
  const [deleting,    setDeleting]    = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const res = await adminApi.getAllStudents(); setStudents(res.data); }
    catch { setError('Failed to load students.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function confirmDelete() {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await adminApi.deleteStudent(deleteModal.id);
      setDeleteModal(null);
      await load();
    } catch { setError('Failed to delete student.'); }
    finally { setDeleting(false); }
  }

  const filtered = students.filter((s) => {
    const q = query.toLowerCase();
    return !q
      || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
      || s.email?.toLowerCase().includes(q)
      || s.city?.toLowerCase().includes(q);
  });

  const AVATAR_COLORS = ['#1a3a6b', '#14532d', '#7c2d12', '#581c87', '#be123c', '#0369a1', '#065f46'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center">Delete Student?</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              <strong>{deleteModal.name}</strong> will be permanently removed along with their account data.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">View all registered students and manage their accounts.</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            <p className="text-xs font-medium text-gray-400 mt-0.5">Total Students</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">
              {students.filter((s) => {
                const d = new Date(s.createdAt);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </p>
            <p className="text-xs font-medium text-gray-400 mt-0.5">Joined This Month</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-gray-900">
              {[...new Set(students.map((s) => s.city).filter(Boolean))].length}
            </p>
            <p className="text-xs font-medium text-gray-400 mt-0.5">Cities Represented</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or city…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {!loading && (
            <p className="text-xs text-gray-400 ml-auto">{filtered.length} of {students.length} students</p>
          )}
        </div>

        {loading ? <PageLoader /> : filtered.length === 0 ? (
          <EmptyState
            icon={<GraduationCap size={36} />}
            title={query ? 'No students match your search' : 'No students yet'}
            description={query ? 'Try a different search term.' : 'Students will appear here once they register.'}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((student, idx) => {
              const open = expanded === student._id;
              const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase();

              return (
                <div key={student._id}>
                  <div className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-xl text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {student.avatar ? (
                        <img src={student.avatar} alt={initials} className="w-full h-full object-cover rounded-xl" />
                      ) : initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{student.firstName} {student.lastName}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Mail size={11} />{student.email}</span>
                        {student.phone && <span className="flex items-center gap-1"><Phone size={11} />{student.phone}</span>}
                        {student.city && <span className="flex items-center gap-1"><MapPin size={11} />{student.city}</span>}
                      </div>
                      {(student.desiredField || student.desiredModule) && (
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {student.desiredField && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">{student.desiredField}</span>
                          )}
                          {student.desiredModule && (
                            <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-medium">{student.desiredModule}</span>
                          )}
                        </div>
                      )}
                      <p className="text-[11px] text-gray-300 mt-0.5">Registered {new Date(student.createdAt).toLocaleDateString()}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => setExpanded(open ? null : student._id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View details"
                      >
                        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                      <button
                        onClick={() => setDeleteModal({ id: student._id, name: `${student.firstName} ${student.lastName}` })}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete student"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {open && (
                    <div className="px-5 pb-5 pt-3 bg-gray-50 border-t border-gray-100">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <DetailCell icon={<Mail size={12} />}     label="Email"          value={student.email} />
                        <DetailCell icon={<Phone size={12} />}    label="Phone"          value={student.phone || '—'} />
                        <DetailCell icon={<MapPin size={12} />}   label="City"           value={student.city || '—'} />
                        <DetailCell icon={<BookOpen size={12} />} label="Desired Field"  value={student.desiredField || '—'} />
                        <DetailCell icon={<GraduationCap size={12} />} label="Desired Module" value={student.desiredModule || '—'} />
                        <DetailCell icon={<Calendar size={12} />} label="Registered"     value={new Date(student.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
                      </div>
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

function DetailCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 px-3 py-2.5">
      <div className="flex items-center gap-1 text-gray-400 mb-0.5">{icon}<span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span></div>
      <p className="text-xs font-semibold text-gray-800 truncate">{value}</p>
    </div>
  );
}
