'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap, Menu, X, ChevronDown, ChevronUp,
  Globe, Users, Award, BookOpen, CheckCircle, Star,
  ArrowRight, FileText, Search, Mail, Phone,
  Shield, Clock, TrendingUp, MapPin, Headphones,
} from 'lucide-react';

/* ─────────────────────────────── helpers ─────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

const STATS = [
  { value: '500+', label: 'Partner Universities', icon: <BookOpen size={22} /> },
  { value: '50 K+', label: 'Students Admitted', icon: <Users size={22} /> },
  { value: '30+', label: 'Countries Served', icon: <Globe size={22} /> },
  { value: '98 %', label: 'Success Rate', icon: <TrendingUp size={22} /> },
];

const DESTINATIONS = [
  { flag: '🇨🇦', name: 'Canada', unis: '120+ universities', color: 'from-red-50 to-red-100', border: 'border-red-200', img: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&auto=format&fit=crop&q=70' },
  { flag: '🇬🇧', name: 'United Kingdom', unis: '95+ universities', color: 'from-blue-50 to-blue-100', border: 'border-blue-200', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&auto=format&fit=crop&q=70' },
  { flag: '🇺🇸', name: 'United States', unis: '150+ universities', color: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', img: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=400&auto=format&fit=crop&q=70' },
  { flag: '🇦🇺', name: 'Australia', unis: '45+ universities', color: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&auto=format&fit=crop&q=70' },
  { flag: '🇩🇪', name: 'Germany', unis: '60+ universities', color: 'from-gray-50 to-gray-100', border: 'border-gray-200', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&auto=format&fit=crop&q=70' },
  { flag: '🇦🇪', name: 'UAE', unis: '30+ universities', color: 'from-green-50 to-green-100', border: 'border-green-200', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&auto=format&fit=crop&q=70' },
];

const STEPS = [
  {
    step: '01',
    icon: <Users size={26} className="text-[#1a3a6b]" />,
    title: 'Create Your Account',
    desc: 'Sign up in minutes. Fill in your basic details and choose whether you\'re a student, agent, or university representative.',
  },
  {
    step: '02',
    icon: <FileText size={26} className="text-[#1a3a6b]" />,
    title: 'Build Your Profile',
    desc: 'Upload your transcripts, language test scores, and personal statement. Our smart form guides you every step.',
  },
  {
    step: '03',
    icon: <Search size={26} className="text-[#1a3a6b]" />,
    title: 'Discover & Apply',
    desc: 'Browse 500+ programs across 30 countries. Filter by scholarship, tuition, intake, and more. Apply with one click.',
  },
  {
    step: '04',
    icon: <CheckCircle size={26} className="text-[#1a3a6b]" />,
    title: 'Track & Get Accepted',
    desc: 'Real-time application tracking, instant notifications on decisions, and dedicated agent support until you land.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Amina Hassan',
    country: 'Nigeria → Canada',
    program: 'MSc Computer Science, University of Toronto',
    quote: 'riftApply made the whole process feel effortless. I had my acceptance letter within 6 weeks of applying. The agent assigned to me was incredible.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ravi Patel',
    country: 'India → United Kingdom',
    program: 'MBA, University of Manchester',
    quote: 'I was confused about UCAS vs direct applications. The platform handled everything and even helped me get a partial scholarship. Truly life-changing.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fatou Diallo',
    country: 'Senegal → Australia',
    program: 'BEng Mechanical Engineering, UNSW',
    quote: 'As a first-generation university student, I was nervous. riftApply\'s step-by-step guidance and 24/7 support gave me the confidence to apply and succeed.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&auto=format&fit=crop&q=80',
  },
];

const FAQS = [
  {
    q: 'Is it free to create an account and apply?',
    a: 'Yes. Creating a student account and submitting applications through riftApply is completely free. There are no hidden fees or subscription charges for students.',
  },
  {
    q: 'How long does the application process take?',
    a: 'It depends on the university and program. Most applications receive a first decision within 2–8 weeks. We keep you updated at every stage so you\'re never left wondering.',
  },
  {
    q: 'Do I need an agent, or can I apply directly?',
    a: 'Both options are available. Students can apply directly through the platform or connect with a verified agent who can provide personalised guidance and increase your chances of acceptance.',
  },
  {
    q: 'What documents do I need to apply?',
    a: 'Typically: academic transcripts, a valid passport, English language test results (IELTS/TOEFL/PTE), a personal statement, and letters of recommendation. Requirements vary by program — the platform will show you exactly what each university needs.',
  },
  {
    q: 'Can I apply to multiple universities at once?',
    a: 'Absolutely. You can apply to as many universities as you like. Once your profile is complete, applying to additional programs takes just a few seconds.',
  },
  {
    q: 'What countries and universities are available?',
    a: 'We partner with 500+ universities across Canada, the UK, USA, Australia, Germany, UAE, and 25+ other countries. New institutions are added regularly.',
  },
  {
    q: 'How do I track my application status?',
    a: 'Your dashboard shows real-time status updates for every application — from "Submitted" to "Under Review" to "Decision Made". You\'ll also receive email and in-app notifications.',
  },
  {
    q: 'What if my application is rejected?',
    a: 'Our agents review rejected applications and advise on alternative programs or next steps such as conditional offers, foundation courses, or re-application strategies.',
  },
];

const FOOTER_LINKS = {
  'Quick Links': [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ],
  'For Students': [
    { label: 'Student Login', href: '/login' },
    { label: 'Create Account', href: '/register' },
    { label: 'Browse Universities', href: '/login' },
    { label: 'Scholarship Guide', href: '#' },
    { label: 'Visa Support', href: '#' },
  ],
  'For Partners': [
    { label: 'University Portal', href: '/login' },
    { label: 'Become an Agent', href: '/register' },
    { label: 'Partner With Us', href: '#' },
    { label: 'Agent Resources', href: '#' },
  ],
};

/* ─────────────────────────────── main ─────────────────────────────── */
export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-white shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="#home" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-[#1a3a6b] rounded-lg flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled || menuOpen ? 'text-[#1a3a6b]' : 'text-white'}`}>
                riftApply
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#3b82f6] ${
                    scrolled ? 'text-gray-600' : 'text-white/90'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                  scrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold px-5 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-lg transition-colors shadow-md"
              >
                Apply Now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled || menuOpen ? 'text-gray-700' : 'text-white'}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-5 pt-3 shadow-lg">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50 text-sm"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 mt-3">
                <Link
                  href="/login"
                  className="flex-1 text-center text-sm font-medium px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center text-sm font-semibold px-4 py-2.5 bg-[#1a3a6b] text-white rounded-lg hover:bg-[#163060]"
                  onClick={() => setMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2544 35%, #1a3a6b 65%, #1e4a8a 100%)' }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.2) 0%, transparent 40%)`,
          }}
        />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 80px,rgba(255,255,255,0.02) 80px,rgba(255,255,255,0.02) 81px), repeating-linear-gradient(90deg,transparent,transparent 80px,rgba(255,255,255,0.02) 80px,rgba(255,255,255,0.02) 81px)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-blue-200 mb-6">
                <Globe size={14} className="text-[#f59e0b]" />
                Trusted by 50,000+ students across 30+ countries
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 tracking-tight">
                Your Dream
                <br />
                <span className="text-[#f59e0b]">University,</span>
                <br />
                Made Possible
              </h1>

              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
                Apply to top-ranked universities in Canada, UK, USA, Australia and 25+ countries.
                Expert agents, one platform, zero confusion.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold px-7 py-3.5 rounded-xl shadow-xl transition-all hover:scale-105 text-base"
                >
                  Start Your Application
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#destinations"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-base"
                >
                  Explore Universities
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 text-sm text-blue-200">
                {[
                  { icon: <CheckCircle size={15} className="text-green-400" />, text: 'Free to apply' },
                  { icon: <Shield size={15} className="text-blue-400" />, text: 'Verified agents' },
                  { icon: <Clock size={15} className="text-yellow-400" />, text: '24/7 support' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-1.5">
                    {b.icon}
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — image mosaic */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                {/* Main large image */}
                <div className="col-span-2 rounded-2xl overflow-hidden h-52 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&auto=format&fit=crop&q=80"
                    alt="Students celebrating graduation with caps and gowns"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                {/* Smaller images */}
                <div className="rounded-2xl overflow-hidden h-44 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80"
                    alt="University campus building in autumn"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden h-44 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80"
                    alt="International students studying together"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -left-6 bottom-12 bg-white rounded-xl shadow-2xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Offer Received!</div>
                  <div className="text-xs text-gray-500">University of Toronto</div>
                </div>
              </div>

              {/* Floating country count */}
              <div className="absolute -right-4 top-6 bg-[#1a3a6b] text-white rounded-xl shadow-2xl px-4 py-3">
                <div className="text-2xl font-extrabold">30+</div>
                <div className="text-xs text-blue-200 font-medium">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 sm:h-16 lg:h-20">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══════════════════ STATS ══════════════════ */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center p-5 rounded-2xl bg-gradient-to-br from-[#0f2544]/5 to-[#1a3a6b]/10 border border-[#1a3a6b]/10">
                <div className="flex justify-center mb-2 text-[#1a3a6b]">{s.icon}</div>
                <div className="text-3xl font-extrabold text-[#1a3a6b] mb-1">{s.value}</div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ ABOUT ══════════════════ */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&auto=format&fit=crop&q=80"
                  alt="Diverse group of students with school bags on campus"
                  className="w-full h-52 object-cover rounded-2xl shadow-lg"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&auto=format&fit=crop&q=80"
                  alt="Student holding admission letter with joy"
                  className="w-full h-52 object-cover rounded-2xl shadow-lg mt-8"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&auto=format&fit=crop&q=80"
                  alt="Students studying in a modern library"
                  className="w-full h-44 object-cover rounded-2xl shadow-lg"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
                  alt="International student with backpack smiling"
                  className="w-full h-44 object-cover rounded-2xl shadow-lg mt-4"
                  loading="lazy"
                />
              </div>
              {/* Accent badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#f59e0b] text-white rounded-2xl px-5 py-3 shadow-xl hidden md:block">
                <div className="text-2xl font-extrabold">10+</div>
                <div className="text-xs font-medium opacity-90">Years of experience</div>
              </div>
            </div>

            {/* Copy */}
            <div>
              <span className="inline-block text-[#1a3a6b] font-semibold text-sm uppercase tracking-widest mb-3">
                About riftApply
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
                Connecting Ambitious Students<br />to World-Class Education
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-5">
                riftApply is a next-generation university admissions platform built to remove barriers between talented students and the world's best institutions. Whether you are applying from Nigeria, India, Pakistan, Senegal, or anywhere else — we are your bridge.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-7">
                We partner with over 500 universities across 30+ countries and work with a network of verified agents who provide expert, personalised guidance from first inquiry all the way to arrival on campus.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: <Award size={18} className="text-[#f59e0b]" />, text: 'Accredited institutions only' },
                  { icon: <Shield size={18} className="text-[#f59e0b]" />, text: 'Verified agent network' },
                  { icon: <Headphones size={18} className="text-[#f59e0b]" />, text: '24/7 student support' },
                  { icon: <TrendingUp size={18} className="text-[#f59e0b]" />, text: '98% application success' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                    {item.icon}
                    {item.text}
                  </div>
                ))}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#163060] text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md"
              >
                Start Your Journey <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ DESTINATIONS ══════════════════ */}
      <section id="destinations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-[#1a3a6b] font-semibold text-sm uppercase tracking-widest mb-3">
              Study Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Explore Top Study Destinations
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base">
              From Canadian campuses to UK heritage universities — find the perfect country for your academic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((d) => (
              <div
                key={d.name}
                className={`group rounded-2xl border ${d.border} overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={d.img}
                    alt={`Students studying in ${d.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className={`bg-gradient-to-br ${d.color} p-5`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{d.flag}</span>
                    <div>
                      <div className="font-bold text-gray-900 text-base">{d.name}</div>
                      <div className="text-sm text-gray-500">{d.unis}</div>
                    </div>
                  </div>
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm font-semibold text-[#1a3a6b] gap-1 hover:gap-2 transition-all"
                  >
                    Browse programs <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section
        id="how-it-works"
        className="py-20"
        style={{ background: 'linear-gradient(135deg, #0f2544 0%, #1a3a6b 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-[#f59e0b] font-semibold text-sm uppercase tracking-widest mb-3">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              From Application to Acceptance
            </h2>
            <p className="text-blue-200 max-w-xl mx-auto text-base">
              Our streamlined 4-step process takes the stress out of international university applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-white/20 z-0" style={{ width: 'calc(100% - 4rem)', left: '4rem' }} />
                )}

                <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      {step.icon}
                    </div>
                    <span className="text-4xl font-extrabold text-white/20 leading-none">{step.step}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{step.title}</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all hover:scale-105 text-base"
            >
              Begin My Application <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-[#1a3a6b] font-semibold text-sm uppercase tracking-widest mb-3">
              Student Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Real Students. Real Results.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base">
              Join thousands of students who turned their international education dreams into reality with riftApply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-[#f59e0b] fill-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.img}
                    alt={`${t.name} — successful riftApply student`}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#1a3a6b]/20"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-[#1a3a6b] font-medium flex items-center gap-1">
                      <MapPin size={11} /> {t.country}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{t.program}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-[#1a3a6b] font-semibold text-sm uppercase tracking-widest mb-3">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-base">
              Everything you need to know before starting your application.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden transition-all ${
                  openFaq === i ? 'border-[#1a3a6b]/40 shadow-md' : 'border-gray-200'
                }`}
              >
                <button
                  className="w-full flex items-center justify-between text-left px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} className="flex-shrink-0 text-[#1a3a6b]" />
                    : <ChevronDown size={18} className="flex-shrink-0 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 bg-[#f8faff] border-t border-[#1a3a6b]/10">
                    <p className="text-gray-600 text-sm leading-relaxed pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA BANNER ══════════════════ */}
      <section className="py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2544 0%, #1e4a8a 100%)' }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">🎓</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Study Abroad?
          </h2>
          <p className="text-blue-200 text-base mb-8 max-w-lg mx-auto leading-relaxed">
            Join over 50,000 students who found their perfect university through riftApply. Your academic future starts with one click.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all hover:scale-105 text-base"
            >
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="bg-[#0a1628] text-gray-400 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

            {/* Brand col */}
            <div className="lg:col-span-2">
              <Link href="#home" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-[#1a3a6b] rounded-lg flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">riftApply</span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-400 mb-5 max-w-xs">
                Connecting ambitious students to world-class universities across 30+ countries through our verified agent network and intuitive platform.
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#f59e0b]" />
                  <span>support@riftapply.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#f59e0b]" />
                  <span>+1 (800) UNI-ADMIT</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#f59e0b]" />
                  <span>Toronto, ON · London, UK · Dubai, UAE</span>
                </div>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} riftApply. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
