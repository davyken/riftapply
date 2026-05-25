'use client';
import { Building2, User, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import type { Agent } from '@/types';

export default function AgentProfilePage() {
  const { user } = useAuthStore();
  const agent = user as Agent | null;

  if (!agent) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <p className="text-sm">No profile data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your personal and company information.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-xl bg-[#1a3a6b] text-white text-xl font-bold flex items-center justify-center flex-shrink-0">
          {agent.firstName?.[0]}{agent.lastName?.[0]}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{agent.firstName} {agent.lastName}</p>
          {agent.companyName && <p className="text-sm text-gray-500">{agent.companyName}</p>}
          <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded mt-1 inline-block capitalize">
            {agent.agentType === 'company' ? 'Company Agent' : 'Personal Agent'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <User size={15} className="text-gray-400" />
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'First Name', value: agent.firstName,   icon: <User size={14} /> },
            { label: 'Last Name',  value: agent.lastName,    icon: <User size={14} /> },
            { label: 'Email',      value: agent.email,       icon: <Mail size={14} /> },
            { label: 'Phone',      value: agent.phone,       icon: <Phone size={14} /> },
            { label: 'City',       value: agent.city ?? '—', icon: <MapPin size={14} /> },
          ].map(({ label, value, icon }) => (
            <div key={label}>
              <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">{icon} {label}</label>
              <p className="text-sm text-gray-900 py-1">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {agent.agentType === 'company' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Building2 size={15} className="text-gray-400" />
            Company Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Company Name',     value: agent.companyName ?? '—',     icon: <Building2 size={14} /> },
              { label: 'Company Location', value: agent.companyLocation ?? '—', icon: <MapPin size={14} /> },
            ].map(({ label, value, icon }) => (
              <div key={label}>
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">{icon} {label}</label>
                <p className="text-sm text-gray-900 py-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FileText size={15} className="text-gray-400" />
          Account Status
        </h2>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center">
            <FileText size={16} className="text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Verification Status</p>
            <p className="text-xs text-gray-400">Account type: {agent.agentType}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
            agent.status === 'active' ? 'bg-green-100 text-green-700' :
            agent.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-600'
          }`}>{agent.status}</span>
        </div>
        {agent.rejectionReason && (
          <p className="text-xs text-red-500 mt-3 bg-red-50 rounded px-3 py-2">{agent.rejectionReason}</p>
        )}
      </div>
    </div>
  );
}
