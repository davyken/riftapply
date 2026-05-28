'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  Search,
  FileText,
  MessageSquare,
  Users,
  ClipboardList,
  Building2,
  ShieldCheck,
  Mail,
  SendHorizonal,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { useSidebarStore } from '@/lib/store/sidebar.store';
import { useNotificationStore } from '@/lib/store/notifications.store';
import { useT } from '@/lib/i18n/useT';
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

// Nav items are built dynamically inside the component using translations
const SHOW_NEW_APP_BTN_ROLES: UserRole[] = ['agent'];

const BADGE_HREF: Partial<Record<UserRole, string>> = {
  student:    '/student/messages',
  agent:      '/agent/messages',
  university: '/university/emails',
  admin:      '/admin/emails',
};

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, role, clearAuth } = useAuthStore();
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebarStore();
  const { unreadCount } = useNotificationStore();
  const { T, t } = useT();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const currentRole = (role || 'student') as UserRole;
  const badgeHref   = BADGE_HREF[currentRole];

  const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
    student: [
      { label: T(t.common.dashboard),     href: '/student',           icon: <LayoutDashboard size={18} /> },
      { label: T(t.sidebar.searchSchools),href: '/student/search',    icon: <Search size={18} /> },
      { label: T(t.sidebar.myDocuments),  href: '/student/documents', icon: <FileText size={18} /> },
      { label: T(t.common.messages),      href: '/student/messages',  icon: <MessageSquare size={18} /> },
    ],
    agent: [
      { label: T(t.common.dashboard),          href: '/agent',              icon: <LayoutDashboard size={18} /> },
      { label: T(t.sidebar.searchSchools),     href: '/agent/search',       icon: <Search size={18} /> },
      { label: T(t.common.students),           href: '/agent/students',     icon: <Users size={18} /> },
      { label: T(t.common.applications),       href: '/agent/applications', icon: <ClipboardList size={18} /> },
      { label: T(t.common.messages),           href: '/agent/messages',     icon: <MessageSquare size={18} /> },
      { label: T(t.sidebar.companyProfile),    href: '/agent/profile',      icon: <Building2 size={18} /> },
      { label: T(t.sidebar.verificationStatus),href: '/agent/verification', icon: <ShieldCheck size={18} /> },
    ],
    university: [
      { label: T(t.common.dashboard),    href: '/university',              icon: <LayoutDashboard size={18} /> },
      { label: T(t.common.applications), href: '/university/applications', icon: <ClipboardList size={18} /> },
      { label: T(t.sidebar.myProfile),   href: '/university/profile',      icon: <UserCircle size={18} /> },
      { label: T(t.sidebar.users),       href: '/university/users',        icon: <Users size={18} /> },
      { label: T(t.common.emails),       href: '/university/emails',       icon: <Mail size={18} /> },
      { label: T(t.common.settings),     href: '/university/settings',     icon: <Settings size={18} /> },
    ],
    admin: [
      { label: T(t.common.dashboard),    href: '/admin',               icon: <LayoutDashboard size={18} /> },
      { label: T(t.common.applications), href: '/admin/applications',  icon: <ClipboardList size={18} /> },
      { label: T(t.common.students),     href: '/admin/students',      icon: <GraduationCap size={18} /> },
      { label: T(t.common.agents),       href: '/admin/agents',        icon: <Users size={18} /> },
      { label: T(t.common.universities), href: '/admin/universities',  icon: <Building2 size={18} /> },
      { label: T(t.common.emails),       href: '/admin/emails',        icon: <Mail size={18} /> },
      { label: 'Bulk Email',             href: '/admin/bulk-email',    icon: <SendHorizonal size={18} /> },
      { label: T(t.common.statistics),   href: '/admin/stats',         icon: <BarChart3 size={18} /> },
      { label: T(t.common.settings),     href: '/admin/settings',      icon: <Settings size={18} /> },
    ],
  };

  const PORTAL_LABEL: Record<UserRole, string> = {
    student:    T(t.sidebar.studentPortal),
    agent:      T(t.sidebar.agentPortal),
    university: T(t.sidebar.universityPortal),
    admin:      T(t.sidebar.adminPortal),
  };

  const navItems = NAV_BY_ROLE[currentRole] || [];

  function logout() {
    clearAuth();
    localStorage.removeItem('token');
    router.push('/login');
  }

  function isActive(href: string) {
    if (href === `/${currentRole}`) return pathname === href;
    return pathname.startsWith(href);
  }

  // ─── Sidebar inner content (shared between mobile drawer & desktop) ───────
  // `isDesktop` = true → apply collapsed logic; false → always show full sidebar
  function SidebarInner({ isDesktop }: { isDesktop: boolean }) {
    const slim = isDesktop && collapsed;

    return (
      <aside className="relative flex flex-col w-full h-full bg-[#0f2544] overflow-y-auto overflow-x-hidden">

        {/* ── Logo ── */}
        <div className={`flex items-center gap-2 border-b border-white/10 px-5 py-5 ${slim ? 'justify-center px-0' : ''}`}>
          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap size={16} className="text-white" />
          </div>
          {!slim && (
            <div>
              <div className="text-sm font-bold text-white leading-tight">riftApply</div>
              <p className="text-[10px] text-blue-300 leading-tight">{PORTAL_LABEL[currentRole]}</p>
            </div>
          )}
        </div>

        {/* ── New Application button (agents only) ── */}
        {SHOW_NEW_APP_BTN_ROLES.includes(currentRole) && (
          <div className={`pt-4 ${slim ? 'px-2' : 'px-4'}`}>
            <button
              onClick={() => { router.push(`/${currentRole}/applications/new`); if (!isDesktop) closeMobile(); }}
              title="New Application"
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              <Plus size={16} />
              {!slim && <span>{T(t.sidebar.newApplication)}</span>}
            </button>
          </div>
        )}

        {/* ── Nav ── */}
        <nav className={`flex-1 py-4 space-y-0.5 ${slim ? 'px-2' : 'px-3'}`}>
          {navItems.map((item) => {
            const itemBadge = item.href === badgeHref && unreadCount > 0 ? unreadCount : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => { if (!isDesktop) closeMobile(); }}
                title={slim ? item.label : undefined}
                className={`
                  flex items-center gap-3 rounded-lg text-sm font-medium transition-colors relative
                  ${slim ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'}
                  ${isActive(item.href)
                    ? 'bg-blue-500/20 text-white'
                    : 'text-blue-200 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <span className={`flex-shrink-0 ${isActive(item.href) ? 'text-blue-300' : 'text-blue-400'}`}>
                  {item.icon}
                </span>
                {!slim && <span>{item.label}</span>}

                {/* Badge */}
                {itemBadge > 0 && (
                  <>
                    {!slim && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-4 rounded-full flex items-center justify-center px-1">
                        {itemBadge > 99 ? '99+' : itemBadge}
                      </span>
                    )}
                    {slim && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom ── */}
        <div className={`py-4 border-t border-white/10 space-y-0.5 ${slim ? 'px-2' : 'px-3'}`}>
          <Link
            href="/help"
            onClick={() => { if (!isDesktop) closeMobile(); }}
            title={slim ? T(t.common.help) : undefined}
            className={`flex items-center gap-3 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/5 hover:text-white transition-colors ${slim ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'}`}
          >
            <HelpCircle size={18} className="text-blue-400 flex-shrink-0" />
            {!slim && <span>{T(t.common.help)}</span>}
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            title={slim ? T(t.common.logout) : undefined}
            className={`w-full flex items-center gap-3 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/5 hover:text-white transition-colors ${slim ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'}`}
          >
            <LogOut size={18} className="text-blue-400 flex-shrink-0" />
            {!slim && <span>{T(t.common.logout)}</span>}
          </button>
        </div>

        {/* ── Collapse toggle button (desktop only) ── */}
        {isDesktop && (
          <button
            onClick={toggle}
            title={collapsed ? T(t.sidebar.expandSidebar) : T(t.sidebar.collapseSidebar)}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1a3a6b] border border-white/20 text-white hover:bg-blue-500 transition-colors absolute -right-3 top-[72px] z-10 shadow-md"
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        )}
      </aside>
    );
  }

  return (
    <>
      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* ── Mobile: slide-in drawer (always full width, never collapsed) ── */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-[220px] h-full md:hidden
          transition-transform duration-200 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarInner isDesktop={false} />
      </div>

      {/* ── Desktop: inline sidebar (collapsible) ── */}
      <div
        className={`
          hidden md:flex flex-shrink-0 h-screen relative
          transition-all duration-200 ease-in-out
          ${collapsed ? 'w-16' : 'w-[220px]'}
        `}
      >
        <SidebarInner isDesktop={true} />
      </div>

      {/* ── Logout confirmation modal ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{T(t.common.confirmLogout)}</h3>
            <p className="text-sm text-gray-500 mb-6">{T(t.common.confirmLogoutMsg)}</p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {T(t.common.cancel)}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                {T(t.common.logout)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
