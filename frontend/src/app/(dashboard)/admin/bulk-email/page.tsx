'use client';
import { useRef, useState } from 'react';
import {
  Mail, Upload, Send, CheckCircle, XCircle, AlertTriangle, Trash2, FileText, Users,
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin.api';

type Tab = 'paste' | 'csv';

interface Result { sent: number; failed: number; total: number }

function parseEmails(raw: string): string[] {
  return raw
    .split(/[\n,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
}

export default function BulkEmailPage() {
  const [tab, setTab] = useState<Tab>('paste');
  const [fromName, setFromName]   = useState('GreatRift Consultancy');
  const [replyTo, setReplyTo]     = useState('');
  const [pasteText, setPasteText] = useState('');
  const [csvEmails, setCsvEmails] = useState<string[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [subject, setSubject]     = useState('');
  const [message, setMessage]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<Result | null>(null);
  const [error, setError]         = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const pastedEmails = parseEmails(pasteText);
  const allEmails    = tab === 'paste' ? pastedEmails : csvEmails;
  const count        = allEmails.length;
  const overLimit    = count > 600;

  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCsvEmails(parseEmails(text));
    };
    reader.readAsText(file);
  }

  async function handleSend() {
    setError('');
    setResult(null);

    if (!fromName.trim())   return setError('From name is required.');
    if (!subject.trim())    return setError('Subject is required.');
    if (!message.trim())    return setError('Message body is required.');
    if (count === 0)        return setError('Add at least one valid recipient email.');
    if (overLimit)          return setError('Maximum 600 recipients per send.');

    setLoading(true);
    try {
      const res = await adminApi.sendCustomBulkEmail({
        fromName: fromName.trim(),
        replyTo:  replyTo.trim() || undefined,
        recipients: allEmails,
        subject:  subject.trim(),
        message:  message.trim(),
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send emails. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError('');
    setPasteText('');
    setCsvEmails([]);
    setCsvFileName('');
    setSubject('');
    setMessage('');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#0f2544] rounded-xl flex items-center justify-center">
            <Mail size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bulk Email Sender</h1>
            <p className="text-sm text-gray-500">Send up to 600 emails at once</p>
          </div>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={22} className="text-green-500" />
            <h2 className="text-lg font-bold text-gray-900">Send Complete</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{result.total}</p>
              <p className="text-xs text-gray-500 mt-1">Total recipients</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{result.sent}</p>
              <p className="text-xs text-gray-500 mt-1">Delivered</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{result.failed}</p>
              <p className="text-xs text-gray-500 mt-1">Failed</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="w-full py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Send Another Email
          </button>
        </div>
      )}

      {!result && (
        <div className="space-y-5">
          {/* From / Reply-To */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Mail size={15} /> Sender Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  From Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="e.g. GreatRift Consultancy"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2544]/30 focus:border-[#0f2544]"
                />
                <p className="text-xs text-gray-400 mt-1">Displayed as the sender name in recipients&apos; inbox</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Reply-To Email <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                  placeholder="e.g. support@riftapply.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2544]/30 focus:border-[#0f2544]"
                />
                <p className="text-xs text-gray-400 mt-1">Where recipients&apos; replies will be sent</p>
              </div>
            </div>
          </div>

          {/* Recipients */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users size={15} /> Recipients
              </h2>
              {count > 0 && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${overLimit ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>
                  {count} / 600 emails
                </span>
              )}
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4 w-fit">
              {(['paste', 'csv'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t === 'paste' ? 'Paste Emails' : 'Upload CSV'}
                </button>
              ))}
            </div>

            {tab === 'paste' && (
              <div>
                <textarea
                  rows={8}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={"Paste email addresses separated by commas, semicolons, or new lines:\n\njohn@example.com\njane@example.com, bob@example.com\nalice@example.com"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0f2544]/30 focus:border-[#0f2544] resize-none"
                />
                {pasteText && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">{pastedEmails.length} valid email{pastedEmails.length !== 1 ? 's' : ''} detected</p>
                    <button onClick={() => setPasteText('')} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                      <Trash2 size={11} /> Clear
                    </button>
                  </div>
                )}
              </div>
            )}

            {tab === 'csv' && (
              <div>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#0f2544] hover:bg-gray-50 transition-colors"
                >
                  {csvFileName ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={28} className="text-[#0f2544]" />
                      <p className="text-sm font-medium text-gray-800">{csvFileName}</p>
                      <p className="text-xs text-gray-500">{csvEmails.length} valid emails found</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={28} className="text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">Click to upload a CSV file</p>
                      <p className="text-xs text-gray-400">One email per row, or comma/semicolon separated</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleCsvUpload}
                />
                {csvFileName && (
                  <button
                    onClick={() => { setCsvEmails([]); setCsvFileName(''); if (fileRef.current) fileRef.current.value = ''; }}
                    className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 size={11} /> Remove file
                  </button>
                )}
              </div>
            )}

            {overLimit && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertTriangle size={13} />
                Too many recipients. Please reduce to 600 or fewer.
              </div>
            )}
          </div>

          {/* Subject & Message */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FileText size={15} /> Email Content
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2544]/30 focus:border-[#0f2544]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={10}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your email message here…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2544]/30 focus:border-[#0f2544] resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Plain text — line breaks are preserved in the email</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <XCircle size={16} />
              {error}
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={loading || overLimit}
            className="w-full bg-[#0f2544] hover:bg-[#163060] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending {count} emails…
              </>
            ) : (
              <>
                <Send size={16} />
                Send to {count > 0 ? `${count} recipient${count !== 1 ? 's' : ''}` : 'recipients'}
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-400">
            Emails are sent from <strong>noreply@riftapply.com</strong> with your chosen display name.
            Replies go to the Reply-To address if set.
          </p>
        </div>
      )}
    </div>
  );
}
