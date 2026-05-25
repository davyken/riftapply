'use client';

import { useEffect, useState, useRef } from 'react';
import { Search, MapPin, Star, BookOpen, Globe, Phone, Mail, X, ExternalLink, ShieldCheck, Upload, Check, FileText } from 'lucide-react';
import { universitiesApi } from '@/lib/api/universities.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { applicationsApi } from '@/lib/api/applications.api';
import { PageLoader, ErrorBanner, EmptyState } from '@/components/ui/PageLoader';
import type { University } from '@/types';

const BG_COLORS = ['#1a3a6b', '#14532d', '#7c2d12', '#581c87', '#be123c', '#0369a1', '#065f46', '#1e40af', '#92400e'];

function StarRating({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-xs ${i <= n ? 'text-yellow-400' : 'text-gray-200'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function SchoolSearch() {
  const { role } = useAuthStore();
  const [unis, setUnis] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  // Application flow states
  const [isApplying, setIsApplying] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [uploads, setUploads] = useState<Record<string, File>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const defaultReqs = ['Passport / National ID', 'English Proficiency Certificate', 'University Transcripts', 'Statement of Purpose'];

  const modalRef = useRef<HTMLDivElement>(null);

  function startApplication() {
    setIsApplying(true);
    setSubmitSuccess(false);
    const firstModule = selectedUni?.modules?.[0];
    setSelectedModule(firstModule?.name || '');
    setSelectedProgram(firstModule?.programs?.[0]?.name || '');
    setUploads({});
    setError('');
  }

  function handleModuleChange(moduleName: string) {
    setSelectedModule(moduleName);
    const mod = selectedUni?.modules?.find(m => m.name === moduleName);
    setSelectedProgram(mod?.programs?.[0]?.name || '');
  }

  function handleFileChange(req: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(`File size limit is 5MB. ${file.name} is too large.`);
      return;
    }
    setError('');
    setUploads(p => ({ ...p, [req]: file }));
  }

  function handleFileRemove(req: string) {
    setUploads(p => {
      const copy = { ...p };
      delete copy[req];
      return copy;
    });
  }

  async function handleSubmitApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUni || !selectedModule || !selectedProgram || submitting) return;

    const requirements = selectedUni.requirements && selectedUni.requirements.length > 0
      ? selectedUni.requirements
      : defaultReqs;

    if (!requirements.every(req => uploads[req])) {
      setError('Please upload all required documents.');
      return;
    }

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('universityId', selectedUni._id);
    formData.append('universityName', selectedUni.name);
    formData.append('moduleName', selectedModule);
    formData.append('programName', selectedProgram);

    requirements.forEach((req) => {
      const file = uploads[req];
      if (file) {
        const cleanName = req.replace(/[^a-zA-Z0-9]/g, '_');
        const ext = file.name.split('.').pop();
        const filename = `${cleanName}.${ext}`;
        formData.append('documents', file, filename);
      }
    });

    try {
      await applicationsApi.create(formData);
      setSubmitSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function load() {
    setLoading(true);
    setError('');
    universitiesApi.getAll()
      .then((r) => setUnis(r.data))
      .catch(() => setError('Failed to load universities.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSelectedUni(null);
        setIsApplying(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close modal when clicking outside of it
  function handleBackdropClick(e: React.MouseEvent) {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedUni(null);
      setIsApplying(false);
    }
  }

  const filtered = unis.filter((u) => {
    const q = query.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.city?.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Schools</h1>
        <p className="text-sm text-gray-500 mt-0.5">Explore verified universities and programs.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by university name or city…"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {!loading && (
          <p className="text-xs text-gray-400 mt-3">
            {filtered.length} {filtered.length === 1 ? 'university' : 'universities'} found
          </p>
        )}
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {loading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={36} />}
          title={query ? 'No universities match your search' : 'No universities available yet'}
          description={query ? 'Try a different search term.' : 'Universities will appear here once they are verified by the admin.'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((uni, i) => {
            const programCount = uni.modules?.reduce((s, m) => s + (m.programs?.length ?? 0), 0) ?? 0;
            return (
              <div
                key={uni._id}
                onClick={() => setSelectedUni(uni)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
              >
                {/* Header Logo Container — fills fully */}
                <div className="h-32 w-full relative overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100">
                  {uni.logo ? (
                    <img
                      src={uni.logo}
                      alt={uni.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundColor: BG_COLORS[i % BG_COLORS.length] }}
                    >
                      <span className="text-white/20 text-5xl font-black select-none">
                        {uni.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {uni.isVerified && (
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm p-1 rounded-full shadow-sm text-green-600">
                      <ShieldCheck size={16} />
                    </div>
                  )}
                </div>

                {/* Card Info Box */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {uni.name}
                    </p>

                    {/* Address & City */}
                    <div className="flex items-start gap-1.5 text-xs text-gray-500">
                      <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {uni.address ? `${uni.address}, ` : ''}
                        {uni.district ? `${uni.district}, ` : ''}
                        {uni.city}
                      </span>
                    </div>

                    {/* Contact Info (Phone) */}
                    {uni.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone size={13} className="text-gray-400 flex-shrink-0" />
                        <span>{uni.phone}</span>
                      </div>
                    )}

                    {/* Contact Info (Website) */}
                    {uni.website && (
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                        <Globe size={13} className="text-blue-400 flex-shrink-0" />
                        <span className="truncate underline">{uni.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                      </div>
                    )}

                    {/* Modules and Submodules list */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Academics (Modules & Submodules)</p>
                      {uni.modules && uni.modules.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                          {uni.modules.slice(0, 3).map((mod, mIdx) => (
                            <div key={mIdx} className="space-y-0.5">
                              <span className="text-[11px] font-bold text-gray-700 block truncate" title={mod.name}>{mod.name}</span>
                              {mod.programs && mod.programs.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {mod.programs.slice(0, 3).map((prog, pIdx) => (
                                    <span key={pIdx} className="bg-gray-100 text-gray-650 text-[9px] px-1.5 py-0.5 rounded font-medium truncate max-w-[120px]" title={prog.name}>
                                      {prog.name}
                                    </span>
                                  ))}
                                  {mod.programs.length > 3 && (
                                    <span className="text-[9px] text-gray-400 font-medium">+{mod.programs.length - 3} more</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[9px] text-gray-400 italic block pl-1">No programs</span>
                              )}
                            </div>
                          ))}
                          {uni.modules.length > 3 && (
                            <p className="text-[10px] text-blue-600 font-medium italic pt-0.5">+{uni.modules.length - 3} more modules...</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No modules listed.</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <StarRating n={4} />
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <BookOpen size={12} className="text-gray-400" />
                      {uni.modules?.length ?? 0} {uni.modules?.length === 1 ? 'module' : 'modules'}
                    </span>
                  </div>

                  <button className="w-full mt-3 bg-[#1a3a6b] hover:bg-[#163060] text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedUni && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
          >
            {/* Modal Top Banner */}
            <div className="bg-gradient-to-r from-[#1a3a6b] to-[#1e4fa0] px-6 py-6 text-white relative">
              <button
                onClick={() => { setSelectedUni(null); setIsApplying(false); }}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/25 hover:bg-black/40 p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex gap-4 items-center">
                {/* Logo */}
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden p-1 flex-shrink-0 border border-white/20">
                  {selectedUni.logo ? (
                    <img src={selectedUni.logo} alt={selectedUni.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#1a3a6b] text-2xl font-black">
                      {selectedUni.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold">{selectedUni.name}</h2>
                    {selectedUni.isVerified && (
                      <span className="bg-green-500/20 border border-green-500/30 text-green-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <ShieldCheck size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-blue-200 flex items-center gap-1 mt-1">
                    <MapPin size={13} />
                    {selectedUni.address ? `${selectedUni.address}, ` : ''}
                    {selectedUni.district ? `${selectedUni.district}, ` : ''}
                    {selectedUni.city}
                  </p>
                </div>
              </div>
            </div>

            {/* School Contact Grid */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedUni.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span className="font-medium">{selectedUni.phone}</span>
                </div>
              )}
              {selectedUni.email && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span className="font-medium truncate">{selectedUni.email}</span>
                </div>
              )}
              {selectedUni.website && (
                <a
                  href={selectedUni.website.startsWith('http') ? selectedUni.website : `https://${selectedUni.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-600 hover:underline font-semibold"
                >
                  <Globe size={14} className="text-blue-500" />
                  <span className="truncate">{selectedUni.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  <ExternalLink size={10} className="flex-shrink-0" />
                </a>
              )}
            </div>

            {/* Modal Body / Application Form */}
            {isApplying ? (
              submitSuccess ? (
                <div className="p-8 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                    <Check size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Application Submitted!</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Your application to <strong>{selectedUni.name}</strong> for the <strong>{selectedProgram}</strong> program has been successfully submitted and forwarded to the Admin dashboard for approval.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => { setSelectedUni(null); setIsApplying(false); }}
                      className="bg-[#1a3a6b] hover:bg-[#163060] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="flex flex-col flex-1 overflow-hidden">
                  <div className="p-6 overflow-y-auto space-y-5 flex-1">
                    <div className="bg-blue-50/40 border border-blue-100/50 rounded-xl p-3.5 flex items-start gap-3">
                      <FileText className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Application Form</h4>
                        <p className="text-[11px] text-blue-750 mt-0.5 leading-relaxed">
                          Please select your program and upload all required documents. The files must be PDF, PNG, JPG, or JPEG formats up to 5MB.
                        </p>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-xs text-red-650 p-3 rounded-lg font-medium">
                        {error}
                      </div>
                    )}

                    {/* Program Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1.5 block">Select Academic Module</label>
                        <select
                          value={selectedModule}
                          onChange={(e) => handleModuleChange(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          {selectedUni.modules?.map((m, idx) => (
                            <option key={idx} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1.5 block">Select Program</label>
                        <select
                          value={selectedProgram}
                          onChange={(e) => setSelectedProgram(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          {selectedUni.modules
                            ?.find(m => m.name === selectedModule)
                            ?.programs?.map((p, idx) => (
                              <option key={idx} value={p.name}>{p.name}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    {/* Prerequisites uploads */}
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-gray-500 block border-b border-gray-100 pb-1">Required Documents</label>
                      
                      {(selectedUni.requirements && selectedUni.requirements.length > 0 ? selectedUni.requirements : defaultReqs).map((req, idx) => {
                        const file = uploads[req];
                        return (
                          <div key={idx} className="border border-gray-150 rounded-lg p-3 bg-white space-y-2 flex flex-col justify-between sm:flex-row sm:items-center sm:gap-4 sm:space-y-0 hover:border-gray-300 transition-colors">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {req}
                              </span>
                              {file && (
                                <span className="text-[10px] text-gray-450 block truncate max-w-[250px] sm:max-w-[350px]">
                                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              )}
                            </div>
                            
                            <div className="flex-shrink-0 flex items-center gap-2">
                              {file ? (
                                <button
                                  type="button"
                                  onClick={() => handleFileRemove(req)}
                                  className="text-xs text-red-500 hover:underline flex items-center gap-0.5"
                                >
                                  <X size={12} /> Remove
                                </button>
                              ) : (
                                <label className="flex items-center gap-1.5 bg-gray-105 hover:bg-blue-50 hover:text-blue-600 text-gray-600 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-semibold">
                                  <Upload size={12} /> Upload File
                                  <input
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                                    onChange={(e) => handleFileChange(req, e)}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-2 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setIsApplying(false)}
                      className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !selectedModule || !selectedProgram || !(selectedUni.requirements && selectedUni.requirements.length > 0 ? selectedUni.requirements : defaultReqs).every(r => uploads[r])}
                      className="bg-[#1a3a6b] hover:bg-[#163060] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting Application…' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )
            ) : (
              <>
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  {/* Prerequisites info strip */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={14} /> Application Prerequisites
                    </h4>
                    <p className="text-xs text-gray-550">You must upload the following documents when applying to this institution:</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(selectedUni.requirements && selectedUni.requirements.length > 0 ? selectedUni.requirements : defaultReqs).map((req, rIdx) => (
                        <span key={rIdx} className="bg-white border border-gray-200 text-gray-700 text-[10.5px] px-2.5 py-1 rounded-lg font-medium shadow-sm">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                      Academic Modules & Programs
                    </h3>

                    {!selectedUni.modules || selectedUni.modules.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        No programs have been registered by this school yet.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {selectedUni.modules.map((mod, idx) => (
                          <div key={idx} className="bg-gray-50/50 rounded-xl border border-gray-100 p-4">
                            <h4 className="text-sm font-bold text-[#1a3a6b] mb-3 uppercase tracking-wider">
                              {mod.name}
                            </h4>
                            
                            {!mod.programs || mod.programs.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">No programs listed under this module.</p>
                            ) : (
                              <div className="space-y-3">
                                {mod.programs.map((prog, pIdx) => (
                                  <div
                                    key={pIdx}
                                    className="bg-white border border-gray-150 rounded-lg p-3.5 shadow-sm hover:border-blue-200 transition-colors"
                                  >
                                    <div className="flex justify-between items-start gap-4">
                                      <div>
                                        <h5 className="text-sm font-semibold text-gray-900">{prog.name}</h5>
                                        {prog.description && (
                                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            {prog.description}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <span className="text-sm font-bold text-[#1a3a6b]">
                                          {prog.currency || '$'}{prog.tuitionFee?.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] text-gray-400 block">per year</span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-gray-50 text-[11px] text-gray-500">
                                      <div>
                                        <span className="text-gray-400 block font-normal">Duration</span>
                                        <span className="font-semibold text-gray-700">{prog.duration} years</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-400 block font-normal">Installments</span>
                                        <span className="font-semibold text-gray-700">
                                          {prog.installments} {prog.installments === 1 ? 'payment' : 'installments'}
                                        </span>
                                      </div>
                                      {prog.availableSeats !== undefined && (
                                        <div className="col-span-2 sm:col-span-1">
                                          <span className="text-gray-400 block font-normal">Available Seats</span>
                                          <span className="font-semibold text-gray-700">{prog.availableSeats}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-2 bg-gray-50">
                  <button
                    onClick={() => { setSelectedUni(null); setIsApplying(false); }}
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Close
                  </button>
                  {(role === 'student' || role === 'agent') && (
                    <button
                      onClick={startApplication}
                      disabled={!selectedUni.modules || selectedUni.modules.length === 0}
                      className="bg-[#1a3a6b] hover:bg-[#163060] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
