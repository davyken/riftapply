'use client';
import { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, Pencil, Bell, Circle, CheckCheck } from 'lucide-react';
import { notificationsApi } from '@/lib/api/notifications.api';
import { useNotificationStore } from '@/lib/store/notifications.store';
import { PageLoader, ErrorBanner } from '@/components/ui/PageLoader';
import type { Notification } from '@/types';

type TemplateKey = 'acceptance' | 'rejection' | 'info_request' | 'pending_review' | 'sent_to_uni';

interface Template {
  key: TemplateKey;
  name: string;
  subject: string;
  body: string;
}

const initialTemplates: Template[] = [
  {
    key: 'acceptance',
    name: 'Application Accepted',
    subject: 'Your application has been accepted — {{universityName}}',
    body: `Dear {{applicantName}},

We are pleased to inform you that your application to {{programName}} at {{universityName}} has been accepted.

Please log in to your portal to review the offer details and confirm your enrollment.

Congratulations!
riftApply Admissions Team`,
  },
  {
    key: 'rejection',
    name: 'Application Rejected',
    subject: 'Update on your application — {{universityName}}',
    body: `Dear {{applicantName}},

We regret to inform you that your application to {{programName}} at {{universityName}} has not been successful at this time.

Reason: {{rejectionReason}}

You are welcome to apply to other programs. Please contact our team if you have any questions.

riftApply Admissions Team`,
  },
  {
    key: 'info_request',
    name: 'Additional Information Required',
    subject: 'Action required — additional documents needed',
    body: `Dear {{applicantName}},

Your application is under review. We require additional information before we can proceed:

{{infoRequested}}

Please upload the requested documents within 7 days through your portal.

riftApply Admissions Team`,
  },
  {
    key: 'pending_review',
    name: 'Application Under Review',
    subject: 'Your application is under review',
    body: `Dear {{applicantName}},

Thank you for submitting your application to {{programName}} at {{universityName}}.

Your application is currently under review by our admissions team. You will be notified within 3–5 business days.

riftApply Admissions Team`,
  },
  {
    key: 'sent_to_uni',
    name: 'Application Forwarded to University',
    subject: 'Your application has been forwarded',
    body: `Dear {{applicantName}},

Your application for {{programName}} at {{universityName}} has been reviewed and forwarded to the university admissions office.

We will notify you once we receive their decision.

riftApply Admissions Team`,
  },
];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function MessageBody({ body }: { body: string }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(body);
  if (isHtml) {
    return (
      <div
        className="text-xs text-gray-700 leading-relaxed [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-2 [&_p]:mb-1.5 [&_strong]:font-semibold [&_br]:block [&_table]:w-full [&_table]:border-collapse [&_table]:my-2 [&_td]:px-2 [&_td]:py-1.5 [&_td]:text-xs [&_td]:border [&_td]:border-gray-100"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }
  return <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{body}</p>;
}

export default function AdminEmailsPage() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [editing,   setEditing]   = useState<TemplateKey | null>(null);
  const [draft,     setDraft]     = useState<Template | null>(null);
  const [saved,     setSaved]     = useState<TemplateKey | null>(null);

  const [msgs,      setMsgs]      = useState<Notification[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [msgError,  setMsgError]  = useState('');
  const [selected,  setSelected]  = useState<Notification | null>(null);
  const { decrement, reset } = useNotificationStore();

  function loadMsgs() {
    setLoadingMsgs(true); setMsgError('');
    notificationsApi.getMine()
      .then((r) => setMsgs(r.data))
      .catch(() => setMsgError('Failed to load notifications.'))
      .finally(() => setLoadingMsgs(false));
  }

  useEffect(() => { loadMsgs(); }, []);

  function openMsg(msg: Notification) {
    setSelected(msg);
    if (!msg.isRead) {
      notificationsApi.markRead(msg._id);
      setMsgs((prev) => prev.map((m) => m._id === msg._id ? { ...m, isRead: true } : m));
      decrement(1);
    }
  }

  const unread = msgs.filter((m) => !m.isRead).length;

  function startEdit(t: Template) {
    setDraft({ ...t });
    setEditing(t.key);
  }

  function saveEdit() {
    if (!draft) return;
    setTemplates((prev) => prev.map((t) => t.key === draft.key ? draft : t));
    setSaved(draft.key);
    setTimeout(() => setSaved(null), 2000);
    setEditing(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Email Center</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage email templates and view system notifications.</p>
      </div>

      {/* Admin Notifications Inbox */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-gray-400" />
            <div>
              <h2 className="font-semibold text-gray-900">Notifications Inbox</h2>
              <p className="text-xs text-gray-400 mt-0.5">University responses and system alerts.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unread > 0 && (
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{unread} unread</span>
            )}
            {unread > 0 && (
              <button
                onClick={() => { msgs.filter(m => !m.isRead).forEach(m => notificationsApi.markRead(m._id)); setMsgs(prev => prev.map(m => ({ ...m, isRead: true }))); reset(); }}
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>
        </div>

        {msgError && <ErrorBanner message={msgError} onRetry={loadMsgs} />}

        <div className="flex divide-x divide-gray-100">
          <div className="flex-1 divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {loadingMsgs ? <PageLoader /> : msgs.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400 text-sm">No notifications yet.</div>
            ) : (
              msgs.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => openMsg(msg)}
                  className={`w-full text-left px-5 py-3.5 hover:bg-gray-50 transition-colors flex items-start gap-3 ${selected?._id === msg._id ? 'bg-blue-50/40' : ''}`}
                >
                  <div className="flex-shrink-0 mt-1.5">
                    {msg.isRead
                      ? <Circle size={7} className="text-gray-200 fill-gray-200" />
                      : <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${msg.isRead ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{stripHtml(msg.body)}</p>
                    <p className="text-[11px] text-gray-300 mt-0.5">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="w-72 flex-shrink-0 p-4">
            {selected ? (
              <div>
                <p className="text-xs font-bold text-gray-900 leading-snug">{selected.subject}</p>
                <p className="text-[11px] text-gray-400 mt-1">{new Date(selected.createdAt).toLocaleDateString()}</p>
                <div className="h-px bg-gray-100 my-3" />
                <MessageBody body={selected.body} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-400 py-6">
                <div>
                  <Bell size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Select a notification</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Email Templates</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Use variables: <code className="bg-gray-100 px-1 rounded text-[11px]">{'{{applicantName}}'}</code>{' '}
            <code className="bg-gray-100 px-1 rounded text-[11px]">{'{{universityName}}'}</code>{' '}
            <code className="bg-gray-100 px-1 rounded text-[11px]">{'{{programName}}'}</code>
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {templates.map((t) => (
            <div key={t.key} className="px-5 py-4">
              {editing === t.key && draft ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(null)} className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Cancel</button>
                      <button onClick={saveEdit} className="flex items-center gap-1 text-xs bg-[#1a3a6b] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#163060]">
                        <CheckCircle size={12} /> Save
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Subject line</label>
                    <input
                      type="text"
                      value={draft.subject}
                      onChange={(e) => setDraft((d) => d ? { ...d, subject: e.target.value } : d)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Email body</label>
                    <textarea
                      rows={8}
                      value={draft.body}
                      onChange={(e) => setDraft((d) => d ? { ...d, body: e.target.value } : d)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <div className="flex items-center gap-2">
                        {saved === t.key && (
                          <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                            <CheckCircle size={12} /> Saved
                          </span>
                        )}
                        <button onClick={() => startEdit(t)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded-lg">
                          <Pencil size={11} /> Edit
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{t.subject}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sent history placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Sent Emails</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {msgs.filter(m => m.type === 'email').length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No sent emails yet.</div>
          ) : (
            msgs.filter(m => m.type === 'email').slice(0, 5).map((m) => (
              <div key={m._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Send size={13} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{m.subject}</p>
                  <p className="text-xs text-gray-400">To: {m.recipientEmail}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">Sent</span>
                  <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
