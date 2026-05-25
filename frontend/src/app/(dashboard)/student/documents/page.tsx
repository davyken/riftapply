'use client';
import { useEffect, useState, useCallback } from 'react';
import { FileText, ExternalLink, Search } from 'lucide-react';
import { applicationsApi } from '@/lib/api/applications.api';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';
import type { Application } from '@/types';

interface DocEntry {
  name: string;
  url: string;
  applicationId: string;
  universityName: string;
  programName: string;
  submittedAt: string;
}

export default function DocumentsPage() {
  const [apps,    setApps]    = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [query,   setQuery]   = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await applicationsApi.getMine();
      setApps(res.data);
    } catch {
      setError('Failed to load your documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const allDocs: DocEntry[] = apps.flatMap((app) =>
    (app.documents ?? []).map((doc) => ({
      name: doc.name,
      url: doc.url,
      applicationId: app._id,
      universityName: app.universityName ?? '',
      programName: app.programName ?? '',
      submittedAt: app.createdAt,
    }))
  );

  const filtered = query
    ? allDocs.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.universityName.toLowerCase().includes(query.toLowerCase()) ||
        d.programName.toLowerCase().includes(query.toLowerCase())
      )
    : allDocs;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          All files you have submitted with your applications.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {!loading && allDocs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{allDocs.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Files</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{apps.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Applications</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-2xl font-bold text-gray-900">
              {new Set(allDocs.map((d) => d.universityName)).size}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Universities</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!loading && allDocs.length > 0 && (
          <div className="px-5 py-3 border-b border-gray-100">
            <div className="relative max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {loading ? (
          <PageLoader />
        ) : allDocs.length === 0 ? (
          <EmptyState
            icon={<FileText size={32} />}
            title="No documents yet"
            description="Documents you upload when applying to universities will appear here."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={32} />}
            title="No matching documents"
            description="Try a different search term."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((doc, i) => (
              <div key={i} className="px-5 py-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText size={16} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {doc.name.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {doc.universityName} · {doc.programName}
                  </p>
                  <p className="text-[11px] text-gray-300 mt-0.5">
                    Submitted {new Date(doc.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0"
                  title="Open document"
                >
                  <ExternalLink size={13} />
                  View
                </a>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {allDocs.length} files
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">About your documents</h3>
        <ul className="space-y-1 text-xs text-blue-700">
          <li>• Documents are uploaded when you submit an application to a university</li>
          <li>• Accepted formats: PDF, JPG, PNG (max 5 MB per file)</li>
          <li>• All documents are securely stored and shared only with the university you applied to</li>
          <li>• To upload new documents, start a new application from the school search</li>
        </ul>
      </div>
    </div>
  );
}
