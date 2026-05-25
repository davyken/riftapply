'use client';
import { useState } from 'react';
import { User, Lock, Bell, Shield, Globe, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState({ firstName: 'Super', lastName: 'Admin', email: 'admin@riftapply.com', phone: '+1-000-000-0000' });
  const [notifs,  setNotifs]  = useState({ newApplications: true, agentRegistrations: true, universityReplies: true, dailyDigest: false });
  const [showPwd, setShowPwd] = useState(false);
  const [pwd,     setPwd]     = useState({ current: '', newPwd: '', confirm: '' });
  const [saved,   setSaved]   = useState('');

  function save(section: string) {
    setSaved(section);
    setTimeout(() => setSaved(''), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your admin account and system preferences.</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User size={15} className="text-gray-400" />
            Admin Profile
          </h2>
          {saved === 'profile' && <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle size={12} />Saved</span>}
        </div>
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
          <div className="w-14 h-14 rounded-xl bg-[#1a3a6b] text-white text-lg font-bold flex items-center justify-center">SA</div>
          <div>
            <p className="text-sm font-bold text-gray-900">{profile.firstName} {profile.lastName}</p>
            <p className="text-xs text-gray-400">{profile.email}</p>
            <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded mt-1 inline-block">System Admin</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(['firstName', 'lastName', 'email', 'phone'] as const).map((field) => (
            <div key={field}>
              <label className="text-xs font-medium text-gray-500 mb-1 block capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={profile[field]}
                onChange={(e) => setProfile((p) => ({ ...p, [field]: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <button onClick={() => save('profile')} className="mt-4 flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#163060] transition-colors">
          <Save size={14} /> Save Profile
        </button>
      </div>

      {/* Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-5">
          <Lock size={15} className="text-gray-400" />
          Change Password
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Current Password', field: 'current' },
            { label: 'New Password',     field: 'newPwd'  },
            { label: 'Confirm Password', field: 'confirm' },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={(pwd as any)[field]}
                  onChange={(e) => setPwd((p) => ({ ...p, [field]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
        {saved === 'password' && <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-3"><CheckCircle size={12} />Password updated</p>}
        <button onClick={() => save('password')} className="mt-4 flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#163060] transition-colors">
          <Lock size={14} /> Update Password
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-5">
          <Bell size={15} className="text-gray-400" />
          Notification Preferences
        </h2>
        <div className="space-y-3">
          {[
            { key: 'newApplications',     label: 'New Applications',           desc: 'Alert when a new application is submitted' },
            { key: 'agentRegistrations',  label: 'Agent Registrations',         desc: 'Alert when a new agent registers' },
            { key: 'universityReplies',   label: 'University Replies',          desc: 'Alert when a university responds to an application' },
            { key: 'dailyDigest',         label: 'Daily Summary Email',         desc: 'Receive a daily summary of platform activity' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${notifs[key as keyof typeof notifs] ? 'bg-[#1a3a6b]' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifs[key as keyof typeof notifs] ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
        {saved === 'notifs' && <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-3"><CheckCircle size={12} />Preferences saved</p>}
        <button onClick={() => save('notifs')} className="mt-4 flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#163060] transition-colors">
          <Save size={14} /> Save Preferences
        </button>
      </div>

      {/* System info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
          <Globe size={15} className="text-gray-400" />
          System Information
        </h2>
        <div className="space-y-2">
          {[
            { label: 'Platform Version',  value: 'riftApply v1.0.0' },
            { label: 'API Server',        value: 'https://api.riftapply.com' },
            { label: 'Environment',       value: 'Production' },
            { label: 'Database',          value: 'MongoDB Atlas (Connected)' },
            { label: 'File Storage',      value: 'Cloudinary (Active)' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-xs font-medium text-gray-500">{label}</span>
              <span className="text-xs text-gray-700 font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-red-700 flex items-center gap-2 mb-2">
          <Shield size={15} />
          Danger Zone
        </h2>
        <p className="text-xs text-red-600 mb-4">Irreversible actions — proceed with caution.</p>
        <button className="text-xs bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
          Reset Platform Data (Dev Only)
        </button>
      </div>
    </div>
  );
}
