'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Building2, MapPin, Globe, Phone, Mail, Plus, Trash2, Save,
  ChevronDown, ChevronUp, Pencil, Check, X, Upload, Image,
  BookOpen, DollarSign, Clock, Users, AlignLeft, CreditCard,
  CheckCircle, FileText,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { universitiesApi } from '@/lib/api/universities.api';
import type { University } from '@/types';

/* ─── types ──────────────────────────────────────────────── */

interface Program {
  id: string;
  name: string;
  duration: number;
  durationUnit: 'years' | 'months';
  tuitionFee: number;
  currency: string;
  installments: number;
  availableSeats: number;
  description: string;
}

interface Module {
  id: string;
  name: string;
  programs: Program[];
  expanded: boolean;
}

/* ─── constants ───────────────────────────────────────────── */

const CURRENCIES = ['DZD', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'MAD', 'TND', 'SAR', 'AED'];
const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 6, 12];

function uid() {
  return Math.random().toString(36).slice(2);
}

function blankProgram(): Program {
  return { id: uid(), name: '', duration: 1, durationUnit: 'years', tuitionFee: 0, currency: 'USD', installments: 1, availableSeats: 30, description: '' };
}

function blankModule(): Module {
  return { id: uid(), name: 'New Module', programs: [], expanded: true };
}

/* ─── seed data ───────────────────────────────────────────── */

const seedModules: Module[] = [
  {
    id: uid(), name: 'Software Engineering', expanded: true,
    programs: [
      { id: uid(), name: 'Web Development',            duration: 1,  durationUnit: 'years',  tuitionFee: 5000,  currency: 'USD', installments: 3, availableSeats: 30, description: 'Full-stack web development with modern frameworks.' },
      { id: uid(), name: 'Mobile App Development',     duration: 1,  durationUnit: 'years',  tuitionFee: 5500,  currency: 'USD', installments: 3, availableSeats: 25, description: '' },
      { id: uid(), name: 'Graphic Design & UI/UX',     duration: 8,  durationUnit: 'months', tuitionFee: 3800,  currency: 'USD', installments: 2, availableSeats: 20, description: '' },
    ],
  },
  {
    id: uid(), name: 'Business Administration', expanded: false,
    programs: [
      { id: uid(), name: 'MBA — General Management',   duration: 2,  durationUnit: 'years',  tuitionFee: 18000, currency: 'USD', installments: 4, availableSeats: 40, description: '' },
      { id: uid(), name: 'Finance & Accounting',       duration: 18, durationUnit: 'months', tuitionFee: 12000, currency: 'USD', installments: 3, availableSeats: 35, description: '' },
    ],
  },
];

/* ─── sub-components ──────────────────────────────────────── */

function InstallmentPicker({ value, fee, currency, onChange }: { value: number; fee: number; currency: string; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-2 block flex items-center gap-1.5">
        <CreditCard size={12} /> Payment Instalments
      </label>
      <div className="flex gap-2 flex-wrap">
        {INSTALLMENT_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex flex-col items-center px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
              value === n
                ? 'border-[#1a3a6b] bg-[#1a3a6b] text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
            }`}
          >
            <span>{n === 1 ? 'Full' : `${n}×`}</span>
            {fee > 0 && (
              <span className={`text-[10px] font-normal mt-0.5 ${value === n ? 'text-blue-200' : 'text-gray-400'}`}>
                {currency} {Math.ceil(fee / n).toLocaleString()}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgramCard({
  program, onSave, onDelete,
}: {
  program: Program;
  onSave: (p: Program) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(program.name === '');
  const [draft, setDraft] = useState<Program>({ ...program });

  function field(key: keyof Program, value: any) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function save() {
    onSave(draft);
    setEditing(false);
  }

  function cancel() {
    if (!program.name) { onDelete(); return; }
    setDraft({ ...program });
    setEditing(false);
  }

  if (!editing) {
    const perInstalment = draft.installments > 1
      ? `${draft.currency} ${Math.ceil(draft.tuitionFee / draft.installments).toLocaleString()} × ${draft.installments}`
      : null;

    return (
      <div className="group flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <BookOpen size={14} className="text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{program.name}</p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={11} />
              {program.duration} {program.durationUnit}
            </span>
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <DollarSign size={11} />
              {program.currency} {program.tuitionFee.toLocaleString()}
            </span>
            {perInstalment ? (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">
                {perInstalment} / instalment
              </span>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Full payment</span>
            )}
            {program.availableSeats > 0 && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Users size={11} /> {program.availableSeats} seats
              </span>
            )}
          </div>
          {program.description && (
            <p className="text-xs text-gray-400 mt-1 truncate">{program.description}</p>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => setEditing(true)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
            <Pencil size={13} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 bg-blue-50/40 border-l-2 border-blue-400">
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Name */}
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-500 mb-1 block flex items-center gap-1">
            <BookOpen size={11} /> Sub-module / Program Name
          </label>
          <input
            autoFocus
            type="text"
            value={draft.name}
            onChange={(e) => field('name', e.target.value)}
            placeholder="e.g. Web Development, Graphic Design…"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block flex items-center gap-1">
            <Clock size={11} /> Duration
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={draft.duration}
              onChange={(e) => field('duration', Number(e.target.value))}
              className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <select
              value={draft.durationUnit}
              onChange={(e) => field('durationUnit', e.target.value)}
              className="flex-1 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        {/* Available seats */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block flex items-center gap-1">
            <Users size={11} /> Available Seats
          </label>
          <input
            type="number"
            min={0}
            value={draft.availableSeats}
            onChange={(e) => field('availableSeats', Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Fee */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block flex items-center gap-1">
            <DollarSign size={11} /> Tuition Fee
          </label>
          <div className="flex gap-2">
            <select
              value={draft.currency}
              onChange={(e) => field('currency', e.target.value)}
              className="w-24 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              type="number"
              min={0}
              step={100}
              value={draft.tuitionFee}
              onChange={(e) => field('tuitionFee', Number(e.target.value))}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block flex items-center gap-1">
            <AlignLeft size={11} /> Short Description (optional)
          </label>
          <input
            type="text"
            value={draft.description}
            onChange={(e) => field('description', e.target.value)}
            placeholder="Brief overview of the program…"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Instalments */}
      <div className="mb-4">
        <InstallmentPicker
          value={draft.installments}
          fee={draft.tuitionFee}
          currency={draft.currency}
          onChange={(v) => field('installments', v)}
        />
      </div>

      {/* Save / cancel */}
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={!draft.name.trim()}
          className="flex items-center gap-1.5 text-xs bg-[#1a3a6b] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#163060] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Check size={13} /> Save Sub-module
        </button>
        <button onClick={cancel} className="text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

function ModuleBlock({
  mod, onUpdate, onDelete,
}: {
  mod: Module;
  onUpdate: (m: Module) => void;
  onDelete: () => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(mod.name);

  function saveName() {
    onUpdate({ ...mod, name: draftName });
    setEditingName(false);
  }

  function toggleExpand() {
    onUpdate({ ...mod, expanded: !mod.expanded });
  }

  function addProgram() {
    onUpdate({ ...mod, programs: [...mod.programs, blankProgram()], expanded: true });
  }

  function updateProgram(idx: number, p: Program) {
    const programs = [...mod.programs];
    programs[idx] = p;
    onUpdate({ ...mod, programs });
  }

  function deleteProgram(idx: number) {
    onUpdate({ ...mod, programs: mod.programs.filter((_, i) => i !== idx) });
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Module header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <button onClick={toggleExpand} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
          {mod.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {editingName ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              autoFocus
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
              className="flex-1 px-2 py-1 text-sm font-semibold border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button onClick={saveName} className="text-green-600 hover:text-green-700"><Check size={15} /></button>
            <button onClick={() => setEditingName(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 group/name">
            <span className="text-sm font-bold text-gray-800">{mod.name}</span>
            <button
              onClick={() => { setDraftName(mod.name); setEditingName(true); }}
              className="text-gray-300 hover:text-gray-500 opacity-0 group-hover/name:opacity-100 transition-opacity"
            >
              <Pencil size={12} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <span className="text-xs text-gray-400">{mod.programs.length} sub-module{mod.programs.length !== 1 ? 's' : ''}</span>
          <button
            onClick={addProgram}
            className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-700 border border-blue-200 bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Plus size={12} /> Add Sub-module
          </button>
          <button onClick={onDelete} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Delete module">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Programs list */}
      {mod.expanded && (
        <div className="divide-y divide-gray-100">
          {mod.programs.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <BookOpen size={24} className="mx-auto mb-2 text-gray-200" />
              <p className="text-xs text-gray-400">No sub-modules yet.</p>
              <button
                onClick={addProgram}
                className="mt-3 text-xs text-blue-600 font-medium hover:underline"
              >
                + Add the first sub-module
              </button>
            </div>
          ) : (
            mod.programs.map((prog, idx) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                onSave={(p) => updateProgram(idx, p)}
                onDelete={() => deleteProgram(idx)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ─── main page ───────────────────────────────────────────── */

export default function UniversityProfilePage() {
  const { user, token, role, setAuth } = useAuthStore();
  const uni = user as University | null;

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const [info, setInfo] = useState({
    name:        '',
    email:       '',
    phone:       '',
    website:     '',
    city:        '',
    district:    '',
    address:     '',
    about:       '',
  });

  const [requirements, setRequirements] = useState<string[]>([]);
  const [newReq, setNewReq] = useState('');
  const [prereqMode, setPrereqMode] = useState<'manual' | 'pdf'>('manual');
  const [parsingPdf, setParsingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsingPdf(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await universitiesApi.parsePrerequisites(formData);
      const extracted: string[] = res.data;
      if (extracted && extracted.length > 0) {
        setRequirements((prev) => {
          const combined = [...prev];
          extracted.forEach((r) => {
            if (!combined.includes(r)) {
              combined.push(r);
            }
          });
          return combined;
        });
      }
    } catch (err) {
      setError('Failed to extract prerequisites from PDF. Please try entering them manually.');
    } finally {
      setParsingPdf(false);
      if (pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
    }
  }

  useEffect(() => {
    if (uni) {
      setInfo({
        name:     uni.name ?? '',
        email:    uni.email ?? '',
        phone:    uni.phone ?? '',
        website:  uni.website ?? '',
        city:     uni.city ?? '',
        district: uni.district ?? '',
        address:  uni.address ?? '',
        about:    uni.about ?? '',
      });
      setLogoPreview(uni.logo ?? null);
      setRequirements(uni.requirements ?? []);
      
      const mapped = (uni.modules || []).map((m: any) => ({
        id: m.id || Math.random().toString(36).slice(2),
        name: m.name,
        expanded: false,
        programs: (m.programs || []).map((p: any) => ({
          id: p.id || Math.random().toString(36).slice(2),
          name: p.name,
          duration: p.duration,
          durationUnit: p.durationUnit || 'years',
          tuitionFee: p.tuitionFee,
          currency: p.currency || 'USD',
          installments: p.installments || 1,
          availableSeats: p.availableSeats ?? 30,
          description: p.description ?? '',
        })),
      }));
      setModules(mapped);
    }
  }, [uni]);

  /* completion score */
  const hasLogo         = !!logoPreview;
  const hasAbout        = info.about.trim().length > 20;
  const hasModules      = modules.length > 0;
  const hasPrograms     = modules.some((m) => m.programs.length > 0);
  const fieldsOk        = !!(info.name && info.email && info.phone && info.city && info.address);
  const hasRequirements = requirements.length > 0;
  
  const completionSteps = [fieldsOk, hasLogo, hasAbout, hasModules, hasPrograms, hasRequirements];
  const completionPct   = Math.round((completionSteps.filter(Boolean).length / completionSteps.length) * 100);

  function infoField(key: keyof typeof info, value: string) {
    setInfo((p) => ({ ...p, [key]: value }));
  }

  function addModule() {
    setModules((prev) => [...prev, blankModule()]);
  }

  function updateModule(idx: number, m: Module) {
    setModules((prev) => prev.map((x, i) => i === idx ? m : x));
  }

  function deleteModule(idx: number) {
    setModules((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  }

  function addRequirement() {
    if (!newReq.trim()) return;
    if (requirements.includes(newReq.trim())) {
      setError('Requirement already exists.');
      return;
    }
    setError('');
    setRequirements((p) => [...p, newReq.trim()]);
    setNewReq('');
  }

  function removeRequirement(idx: number) {
    setRequirements((p) => p.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', info.name);
      formData.append('email', info.email);
      formData.append('phone', info.phone);
      formData.append('website', info.website);
      formData.append('city', info.city);
      formData.append('district', info.district);
      formData.append('address', info.address);
      formData.append('about', info.about);
      
      const cleanedModules = modules.map(m => ({
        name: m.name,
        programs: m.programs.map(p => ({
          name: p.name,
          duration: p.duration,
          durationUnit: p.durationUnit,
          tuitionFee: p.tuitionFee,
          currency: p.currency,
          installments: p.installments,
          availableSeats: p.availableSeats,
          description: p.description
        }))
      }));
      formData.append('modules', JSON.stringify(cleanedModules));
      formData.append('requirements', JSON.stringify(requirements));

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await universitiesApi.updateProfile(formData);
      setAuth({ ...uni!, ...res.data }, token!, role!);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">University Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete your profile to appear in student searches and start receiving applications.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-[#1a3a6b] hover:bg-[#163060] text-white disabled:opacity-50'
          }`}
        >
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> {saving ? 'Saving...' : 'Save Profile'}</>}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-650">
          {error}
        </div>
      )}

      {/* Completion banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">Profile Completion</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {completionPct < 100 ? 'Complete all sections to publish your profile to students.' : 'Your profile is complete!'}
            </p>
          </div>
          <span className={`text-2xl font-bold ${completionPct === 100 ? 'text-green-500' : 'text-gray-900'}`}>{completionPct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${completionPct === 100 ? 'bg-green-500' : 'bg-[#1a3a6b]'}`}
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: 'Basic Info',   done: fieldsOk },
            { label: 'Logo',         done: hasLogo },
            { label: 'About',        done: hasAbout },
            { label: 'Modules',      done: hasModules },
            { label: 'Sub-modules',  done: hasPrograms },
            { label: 'Prerequisites', done: hasRequirements },
          ].map((s) => (
            <span key={s.label} className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${s.done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              {s.done ? <Check size={11} /> : <X size={11} />}
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Section 1: Identity ───────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Building2 size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">University Identity</h2>
        </div>
        <div className="p-6 space-y-5">

          {/* Logo */}
          <div className="flex items-center gap-5">
            <div
              onClick={() => logoRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all overflow-hidden flex-shrink-0 group"
            >
              {logoPreview ? (
                <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Image size={20} className="text-gray-300 mx-auto group-hover:text-blue-400 transition-colors" />
                  <p className="text-[10px] text-gray-300 mt-1 group-hover:text-blue-400">Logo</p>
                </div>
              )}
            </div>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            <div>
              <button onClick={() => logoRef.current?.click()} className="flex items-center gap-2 text-sm text-blue-600 font-medium border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                <Upload size={14} /> {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </button>
              <p className="text-xs text-gray-400 mt-1.5">PNG, JPG or SVG — max 2 MB. Shown on your public profile.</p>
            </div>
          </div>

          {/* Basic fields */}
          <div className="grid grid-cols-2 gap-4">
            {([
              { label: 'University Name',  field: 'name',     icon: <Building2 size={13} />, required: true },
              { label: 'Official Email',   field: 'email',    icon: <Mail size={13} />,      required: true },
              { label: 'Phone Number',     field: 'phone',    icon: <Phone size={13} />,     required: true },
              { label: 'Website',          field: 'website',  icon: <Globe size={13} />,     required: false },
              { label: 'City',             field: 'city',     icon: <MapPin size={13} />,    required: true },
              { label: 'District / State', field: 'district', icon: <MapPin size={13} />,    required: false },
            ] as { label: string; field: keyof typeof info; icon: React.ReactNode; required: boolean }[]).map(({ label, field, icon, required }) => (
              <div key={field}>
                <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                  {icon} {label} {required && <span className="text-red-400">*</span>}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={info[field]}
                  onChange={(e) => infoField(field, e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
              <MapPin size={13} /> Full Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={info.address}
              onChange={(e) => infoField('address', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* About */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
              <AlignLeft size={13} /> About / Description
            </label>
            <textarea
              rows={4}
              value={info.about}
              onChange={(e) => infoField('about', e.target.value)}
              placeholder="Describe your university — its history, strengths, campus, and what makes it special for prospective students…"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{info.about.length} characters</p>
          </div>
        </div>
      </div>

      {/* ── Section 2: Modules & Programs ─────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gray-400" />
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Modules & Sub-modules Catalog</h2>
              <p className="text-xs text-gray-400 mt-0.5">Each module is a faculty or field. Sub-modules are the specific programs students apply for.</p>
            </div>
          </div>
          <button
            onClick={addModule}
            className="flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#163060] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            <Plus size={14} /> Add Module
          </button>
        </div>

        <div className="p-5 space-y-4">
          {modules.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={36} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm font-semibold text-gray-500">No modules yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Module" to create your first faculty or field of study.</p>
              <button onClick={addModule} className="mt-4 flex items-center gap-2 mx-auto text-sm text-blue-600 font-medium border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                <Plus size={14} /> Add First Module
              </button>
            </div>
          ) : (
            modules.map((mod, idx) => (
              <ModuleBlock
                key={mod.id}
                mod={mod}
                onUpdate={(m) => updateModule(idx, m)}
                onDelete={() => deleteModule(idx)}
              />
            ))
          )}
        </div>

        {modules.length > 0 && (
          <div className="px-5 pb-5">
            <button
              onClick={addModule}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500 text-sm font-medium py-3 rounded-xl transition-colors"
            >
              <Plus size={16} /> Add Another Module
            </button>
          </div>
        )}
      </div>

      {/* ── Section 3: Prerequisites for Admission ────── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-800">Admission Prerequisites (Required Documents)</h2>
          </div>
          {/* Mode toggles */}
          <div className="flex border border-gray-200 rounded-lg p-0.5 bg-gray-50 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setPrereqMode('manual')}
              className={`px-3 py-1 rounded transition-all ${prereqMode === 'manual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Manual Entry
            </button>
            <button
              type="button"
              onClick={() => setPrereqMode('pdf')}
              className={`px-3 py-1 rounded transition-all ${prereqMode === 'pdf' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Import from PDF
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-gray-450 leading-relaxed">
            Specify all documents or criteria that students must upload or fulfill when applying to your university (e.g. Passport, High School Transcript).
          </p>

          {prereqMode === 'manual' ? (
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
          ) : (
            <div className="bg-gray-50 border border-gray-150 rounded-xl p-6 text-center border-dashed">
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
              {parsingPdf ? (
                <div className="space-y-2">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600 mx-auto" />
                  <p className="text-xs font-semibold text-gray-600">Reading and extracting prerequisites from admission form…</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <FileText className="text-gray-300 mx-auto" size={32} />
                  <div>
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      className="bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                    >
                      Choose Admission Form PDF
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2">
                      Upload your university's official application form or handbook in PDF format. We will auto-detect documents/prerequisites using text analysis.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {requirements.map((req, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-150 rounded-lg p-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-xs text-gray-755 font-medium truncate">{req}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeRequirement(idx)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {requirements.length === 0 && (
              <p className="col-span-2 text-xs text-gray-400 italic">No prerequisites specified. Students will be able to apply without uploads.</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {modules.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Catalog Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{modules.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Modules</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{modules.reduce((s, m) => s + m.programs.length, 0)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Sub-modules</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{modules.reduce((s, m) => s + m.programs.reduce((ss, p) => ss + (p.availableSeats || 0), 0), 0)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total Seats</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
