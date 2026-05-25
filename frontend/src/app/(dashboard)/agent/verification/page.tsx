'use client';
import { CheckCircle2, Clock, ShieldCheck, ShieldAlert, Mail } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import type { Agent } from '@/types';

export default function VerificationPage() {
  const { user } = useAuthStore();
  const agent = user as Agent | null;

  const status = agent?.status ?? 'pending';

  const cfg = {
    active: {
      icon:   <ShieldCheck size={28} className="text-green-500" />,
      title:  'Account Verified',
      desc:   'Your account has been verified. You can now submit applications on behalf of your students.',
      banner: 'bg-green-50 border-green-200',
      badge:  'bg-green-100 text-green-700',
    },
    pending: {
      icon:   <Clock size={28} className="text-yellow-500" />,
      title:  'Verification Pending',
      desc:   'Your account is currently under review. This usually takes 1–3 business days.',
      banner: 'bg-yellow-50 border-yellow-200',
      badge:  'bg-yellow-100 text-yellow-700',
    },
    rejected: {
      icon:   <ShieldAlert size={28} className="text-red-500" />,
      title:  'Verification Rejected',
      desc:   'Your verification was declined. Please review the reason below and contact support.',
      banner: 'bg-red-50 border-red-200',
      badge:  'bg-red-100 text-red-600',
    },
    blocked: {
      icon:   <ShieldAlert size={28} className="text-red-500" />,
      title:  'Account Blocked',
      desc:   'Your account has been blocked. Please contact support for assistance.',
      banner: 'bg-red-50 border-red-200',
      badge:  'bg-red-100 text-red-600',
    },
  }[status] ?? {
    icon:   <Clock size={28} className="text-gray-400" />,
    title:  'Status Unknown',
    desc:   'Unable to determine your account status. Please contact support.',
    banner: 'bg-gray-50 border-gray-200',
    badge:  'bg-gray-100 text-gray-600',
  };

  const steps = [
    { label: 'Account Created',       done: !!agent, date: agent?.createdAt ? new Date(agent.createdAt).toLocaleDateString() : null },
    { label: 'Documents Submitted',   done: !!agent, date: null },
    { label: 'Admin Review',          done: status !== 'pending', date: null },
    { label: 'Account Activated',     done: status === 'active', date: null },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verification Status</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track the status of your agent account verification.</p>
      </div>

      <div className={`rounded-xl border p-6 flex items-start gap-4 ${cfg.banner}`}>
        <div className="flex-shrink-0 mt-0.5">{cfg.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-base font-bold text-gray-900">{cfg.title}</h2>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${cfg.badge}`}>{status}</span>
          </div>
          <p className="text-sm text-gray-600">{cfg.desc}</p>
        </div>
      </div>

      {agent?.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason</p>
          <p className="text-sm text-red-700">{agent.rejectionReason}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Verification Timeline</h2>
        <ol className="space-y-0">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${step.done ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <CheckCircle2 size={14} className={step.done ? 'text-white' : 'text-gray-400'} />
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 h-8 mt-1 ${step.done && steps[i + 1]?.done ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="pb-6">
                <p className={`text-sm font-semibold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                {step.date && <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-center gap-4">
        <Mail size={20} className="text-gray-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-700">Need help with verification?</p>
          <p className="text-xs text-gray-500">Contact our support team at <span className="text-blue-600 font-medium">support@riftapply.com</span></p>
        </div>
      </div>
    </div>
  );
}
