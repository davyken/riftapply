'use client';
import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Circle, MessageSquare } from 'lucide-react';
import { notificationsApi } from '@/lib/api/notifications.api';
import { useNotificationStore } from '@/lib/store/notifications.store';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';
import type { Notification } from '@/types';

const TYPE_CONFIG: Record<string, { badge: string; dot: string }> = {
  email:     { badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  dashboard: { badge: 'bg-gray-100 text-gray-600',   dot: 'bg-gray-400' },
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function MessageBody({ body }: { body: string }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(body);
  if (isHtml) {
    return (
      <div
        className="text-sm text-gray-700 leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_p]:mb-2 [&_strong]:font-semibold [&_br]:block [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:border [&_td]:border-gray-100"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }
  return <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{body}</p>;
}

export default function AgentMessagesPage() {
  const [msgs,     setMsgs]     = useState<Notification[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [selected, setSelected] = useState<Notification | null>(null);
  const { decrement, reset } = useNotificationStore();

  function load() {
    setLoading(true); setError('');
    notificationsApi.getMine()
      .then((r) => setMsgs(r.data))
      .catch(() => setError('Failed to load messages.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function open(msg: Notification) {
    setSelected(msg);
    if (!msg.isRead) {
      notificationsApi.markRead(msg._id);
      setMsgs((prev) => prev.map((m) => m._id === msg._id ? { ...m, isRead: true } : m));
      decrement(1);
    }
  }

  const unread = msgs.filter((m) => !m.isRead).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">Notifications about your submitted applications.</p>
        </div>
        {unread > 0 && (
          <button
            onClick={() => {
              msgs.forEach((m) => { if (!m.isRead) notificationsApi.markRead(m._id); });
              setMsgs((prev) => prev.map((m) => ({ ...m, isRead: true })));
              reset();
            }}
            className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {unread > 0 && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <Bell size={16} className="text-blue-500" />
          <span className="text-sm text-blue-700 font-medium">{unread} unread message{unread !== 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Inbox</span>
            <span className="text-xs text-gray-400">{msgs.length} messages</span>
          </div>
          {loading ? <PageLoader /> : msgs.length === 0 ? (
            <EmptyState
              icon={<MessageSquare size={32} />}
              title="No messages yet"
              description="You'll be notified here when there are updates on your applications."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {msgs.map((msg) => {
                const cfg = TYPE_CONFIG[msg.type] ?? TYPE_CONFIG.dashboard;
                return (
                  <button key={msg._id} onClick={() => open(msg)}
                    className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-start gap-3 ${selected?._id === msg._id ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex-shrink-0 mt-2">
                      {msg.isRead
                        ? <Circle size={8} className="text-gray-200 fill-gray-200" />
                        : <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${msg.isRead ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>{msg.subject}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded flex-shrink-0 ${cfg.badge}`}>{msg.type}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{stripHtml(msg.body)}</p>
                      <p className="text-[11px] text-gray-300 mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selected ? (
          <div className="w-full lg:w-[360px] lg:flex-shrink-0 bg-white rounded-xl border border-gray-200 p-5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${TYPE_CONFIG[selected.type]?.badge ?? 'bg-gray-100 text-gray-600'}`}>
              {selected.type}
            </span>
            <h2 className="text-base font-bold text-gray-900 mt-3 leading-snug">{selected.subject}</h2>
            <p className="text-xs text-gray-400 mt-1">{new Date(selected.createdAt).toLocaleDateString()}</p>
            <div className="h-px bg-gray-100 my-4" />
            <MessageBody body={selected.body} />
          </div>
        ) : (
          <div className="hidden lg:flex w-[360px] flex-shrink-0 bg-white rounded-xl border border-gray-200 items-center justify-center">
            <div className="text-center text-gray-400 p-8">
              <Bell size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Select a message to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
