'use client';

import { useState } from 'react';
import { Building2, MapPin, Globe, Phone, Mail, Save, Pencil, X, Check, FileText } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { universitiesApi } from '@/lib/api/universities.api';
import type { University } from '@/types';

export default function UniversitySettingsPage() {
  const { user, setAuth, role, token } = useAuthStore();
  const uni = user as University | null;

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [newReq,  setNewReq]  = useState('');

  const defaultReqs = ['Passport / National ID', 'English Proficiency Certificate', 'University Transcripts', 'Statement of Purpose'];

  const [form, setForm] = useState({
    name:         uni?.name         ?? '',
    email:        uni?.email        ?? '',
    phone:        uni?.phone        ?? '',
    website:      uni?.website      ?? '',
    city:         uni?.city         ?? '',
    district:     uni?.district     ?? '',
    address:      uni?.address      ?? '',
    requirements: uni?.requirements ?? defaultReqs,
  });

  function handleCancel() {
    setForm({
      name:         uni?.name         ?? '',
      email:        uni?.email        ?? '',
      phone:        uni?.phone        ?? '',
      website:      uni?.website      ?? '',
      city:         uni?.city         ?? '',
      district:     uni?.district     ?? '',
      address:      uni?.address      ?? '',
      requirements: uni?.requirements ?? defaultReqs,
    });
    setNewReq('');
    setEditing(false);
    setError('');
  }

  function addRequirement() {
    if (!newReq.trim()) return;
    if (form.requirements.includes(newReq.trim())) {
      setError('Requirement already exists.');
      return;
    }
    setError('');
    setForm((p) => ({
      ...p,
      requirements: [...p.requirements, newReq.trim()],
    }));
    setNewReq('');
  }

  function removeRequirement(idx: number) {
    setForm((p) => ({
      ...p,
      requirements: p.requirements.filter((_, i) => i !== idx),
    }));
  }

  async function save() {
    setSaving(true); setError('');
    try {
      const res = await universitiesApi.updateProfile(form);
      setAuth({ ...uni!, ...res.data }, token!, role!);
      setEditing(false);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your university account information and application prerequisites.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Building2 size={15} className="text-gray-400" />
            University Information
          </h2>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg">
              <Pencil size={12} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                <X size={12} /> Cancel
              </button>
              <button disabled={saving} onClick={save} className="flex items-center gap-1.5 text-xs bg-[#1a3a6b] text-white font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50">
                <Save size={12} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'University Name', field: 'name',     icon: <Building2 size={13} /> },
            { label: 'Email',           field: 'email',    icon: <Mail size={13} /> },
            { label: 'Phone',           field: 'phone',    icon: <Phone size={13} /> },
            { label: 'Website',         field: 'website',  icon: <Globe size={13} /> },
            { label: 'City',            field: 'city',     icon: <MapPin size={13} /> },
            { label: 'District',        field: 'district', icon: <MapPin size={13} /> },
          ].map(({ label, field, icon }) => (
            <div key={field}>
              <label className="text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">{icon}{label}</label>
              {editing ? (
                <input type="text" value={(form as any)[field]}
                  onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              ) : (
                <p className="text-sm text-gray-900 py-2">{(form as any)[field] || <span className="text-gray-300">—</span>}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-gray-400 mb-1 flex items-center gap-1"><MapPin size={13} /> Full Address</label>
          {editing ? (
            <input type="text" value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          ) : (
            <p className="text-sm text-gray-900 py-2">{form.address || <span className="text-gray-300">—</span>}</p>
          )}
        </div>
      </div>

      {/* Prerequisites / Requirements Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
          <FileText size={15} className="text-gray-400" />
          Application Prerequisites (Required Documents)
        </h2>
        <p className="text-xs text-gray-450 mb-4 leading-relaxed">
          Specify all the documents or criteria that students must upload or fulfill when applying to your university.
        </p>

        {editing ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newReq}
                onChange={(e) => setNewReq(e.target.value)}
                placeholder="e.g. TOEFL/IELTS Certificate, High School Diploma..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="bg-[#1a3a6b] hover:bg-[#163060] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {form.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-150 rounded-lg p-2.5">
                  <span className="text-xs text-gray-750 font-medium">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(idx)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {form.requirements.length === 0 && (
                <p className="text-xs text-gray-400 italic">No requirements specified. Students will be able to apply without uploads.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(uni?.requirements || defaultReqs).map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Account Status</h2>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize ${
            uni?.status === 'active' ? 'bg-green-100 text-green-700' :
            uni?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-600'
          }`}>{uni?.status ?? 'unknown'}</span>
          <p className="text-xs text-gray-500">{uni?.isVerified ? 'Verified account' : 'Account pending verification'}</p>
        </div>
      </div>
    </div>
  );
}
