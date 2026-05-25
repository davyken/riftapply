'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, Users, Building2, ClipboardList, CheckCircle } from 'lucide-react';
import { adminApi } from '@/lib/api/admin.api';
import { PageLoader, ErrorBanner } from '@/components/ui/PageLoader';
import BarChartWidget from '@/components/ui/BarChartWidget';
import type { AdminStats } from '@/types';

export default function AdminStatsPage() {
  const [stats,   setStats]   = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  async function load() {
    setLoading(true); setError('');
    try { const res = await adminApi.getStats(); setStats(res.data); }
    catch { setError('Failed to load statistics.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <PageLoader />;
  if (error)   return <div className="p-6"><ErrorBanner message={error} onRetry={load} /></div>;
  if (!stats)  return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform-wide metrics and performance overview.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Students',    value: stats.students,                              icon: <ClipboardList size={18} className="text-blue-500" />,  bg: 'bg-blue-50'   },
          { label: 'Total Agents',      value: stats.agents.total,      sub: `${stats.agents.pending} pending`,       icon: <Users size={18} className="text-purple-500" />,   bg: 'bg-purple-50' },
          { label: 'Universities',      value: stats.universities.total, sub: `${stats.universities.pending} pending`, icon: <Building2 size={18} className="text-orange-500" />, bg: 'bg-orange-50' },
          { label: 'Total Applications',value: stats.applications.total, sub: `${stats.applications.pendingReview} pending review`, icon: <CheckCircle size={18} className="text-green-500" />, bg: 'bg-green-50' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>{k.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{k.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{k.label}</p>
            {k.sub && <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Applications Overview</h3>
          <p className="text-xs text-gray-400 mb-4">Pending review vs total</p>
          <div className="h-40">
            <BarChartWidget data={[
              { month: 'Total',   value: stats.applications.total },
              { month: 'Pending', value: stats.applications.pendingReview },
              { month: 'Uni replies', value: stats.universityRepliesAwaitingAction },
            ]} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Accounts Overview</h3>
          <p className="text-xs text-gray-400 mb-4">Students, agents, universities</p>
          <div className="h-40">
            <BarChartWidget data={[
              { month: 'Students',    value: stats.students },
              { month: 'Agents',      value: stats.agents.total },
              { month: 'Universities',value: stats.universities.total },
            ]} color="#10b981" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Platform Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Pending Agent Approvals',       value: stats.agents.pending,                         color: 'text-yellow-600' },
            { label: 'Pending University Approvals',  value: stats.universities.pending,                   color: 'text-yellow-600' },
            { label: 'Applications Awaiting Review',  value: stats.applications.pendingReview,             color: 'text-orange-600' },
            { label: 'University Replies Awaiting',   value: stats.universityRepliesAwaitingAction,        color: 'text-purple-600' },
            { label: 'Active Agents',                 value: stats.agents.total - stats.agents.pending,    color: 'text-green-600' },
            { label: 'Active Universities',           value: stats.universities.total - stats.universities.pending, color: 'text-green-600' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
