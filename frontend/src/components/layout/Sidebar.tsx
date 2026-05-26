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
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  student: [
    { label: 'Dashboard',      href: '/student',            icon: <LayoutDashboard size={18} /> },
    { label: 'Search Schools', href: '/student/search',     icon: <Search size={18} /> },
    { label: 'My Documents',   href: '/student/documents',  icon: <FileText size={18} /> },
    { label: 'Messages',       href: '/student/messages',   icon: <MessageSquare size={18} /> },
  ],
  agent: [
    { label: 'Dashboard',           href: '/agent',               icon: <LayoutDashboard size={18} /> },
    { label: 'Search Schools',      href: '/agent/search',        icon: <Search size={18} /> },
    { label: 'Students',            href: '/agent/students',      icon: <Users size={18} /> },
    { label: 'Applications',        href: '/agent/applications',  icon: <ClipboardList size={18} /> },
    { label: 'Messages',            href: '/agent/messages',      icon: <MessageSquare size={18} /> },
    { label: 'Company Profile',     href: '/agent/profile',       icon: <Building2 size={18} /> },
    { label: 'Verification Status', href: '/agent/verification',  icon: <ShieldCheck size={18} /> },
  ],
  university: [
    { label: 'Dashboard',    href: '/university',               icon: <LayoutDashboard size={18} /> },
    { label: 'Applications', href: '/university/applications',  icon: <ClipboardList size={18} /> },
    { label: 'My Profile',   href: '/university/profile',       icon: <UserCircle size={18} /> },
    { label: 'Users',        href: '/university/users',         icon: <Users size={18} /> },
    { label: 'Emails',       href: '/university/emails',        icon: <Mail size={18} /> },
    { label: 'Settings',     href: '/university/settings',      icon: <Settings size={18} /> },
  ],
  admin: [
    { label: 'Dashboard',    href: '/admin',                icon: <LayoutDashboard size={18} /> },
    { label: 'Applications', href: '/admin/applications',   icon: <ClipboardList size={18} /> },
    { label: 'Students',     href: '/admin/students',       icon: <GraduationCap size={18} /> },
    { label: 'Agents',       href: '/admin/agents',         icon: <Users size={18} /> },
    { label: 'Universities', href: '/admin/universities',   icon: <Building2 size={18} /> },
    { label: 'Emails',       href: '/admin/emails',         icon: <Mail size={18} /> },
    { label: 'Statistics',   href: '/admin/stats',          icon: <BarChart3 size={18} /> },
    { label: 'Settings',     href: '/admin/settings',       icon: <Settings size={18} /> },
  ],
};

const PORTAL_LABEL: Record<UserRole, string> = {
  student:    'Student Portal',
  agent:      'Admissions Portal',
  university: 'Admissions Portal',
  admin:      'Admin Portal',
};

const SHOW_NEW_APP_BTN: UserRole[] = ['agent'];

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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const currentRole = (role || 'student') as UserRole;
  const navItems    = NAV_BY_ROLE[currentRole] || [];
  const badgeHref   = BADGE_HREF[currentRole];

  function logout() {
    clearAuth();
    localStorage.removeItem('token');
    router.push('/login');
  }

  function isActive(href: string) {
    if (href === `/${currentRole}`) return pathname === href;
    return pathname.startsWith(href);
  }

  function handleNavClick() {
    closeMobile();
  }

  const sidebarContent = (
    <aside
      className={`
        relative flex flex-col flex-shrink-0 bg-[#0f2544] h-full overflow-y-auto overflow-x-hidden
        transition-all duration-200 ease-in-out
        w-[220px] md:${collapsed ? 'w-16' : 'w-[220px]'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2 border-b border-white/10 ${collapsed ? 'md:justify-center md:px-0 px-5 py-5' : 'px-5 py-5'}`}>
        <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
          <GraduationCap size={16} className="text-white" />
        </div>
        <div className={collapsed ? 'md:hidden' : ''}>
          <div className="text-sm font-bold text-white leading-tight">riftApply</div>
          <p className="text-[10px] text-blue-300 leading-tight">{PORTAL_LABEL[currentRole]}</p>
        </div>
      </div>

      {/* New Application button */}
      {SHOW_NEW_APP_BTN.includes(currentRole) && (
        <div className={`pt-4 ${collapsed ? 'md:px-2 px-4' : 'px-4'}`}>
          <button
            onClick={() => { router.push(`/${currentRole}/applications/new`); handleNavClick(); }}
            title="New Application"
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span className={collapsed ? 'md:hidden' : ''}>New Application</span>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className={`flex-1 py-4 space-y-0.5 ${collapsed ? 'md:px-2 px-3' : 'px-3'}`}>
        {navItems.map((item) => {
          const itemBadge = item.href === badgeHref && unreadCount > 0 ? unreadCount : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors relative
                ${collapsed ? 'md:px-0 md:py-2.5 md:justify-center px-3 py-2.5' : 'px-3 py-2.5'}
                ${isActive(item.href)
                  ? 'bg-blue-500/20 text-white'
                  : 'text-blue-200 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className={`flex-shrink-0 ${isActive(item.href) ? 'text-blue-300' : 'text-blue-400'}`}>
                {item.icon}
              </span>
              <span className={collapsed ? 'md:hidden' : ''}>{item.label}</span>
              {itemBadge > 0 && (
                <>
                  <span className={`ml-auto bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-4 rounded-full flex items-center justify-center px-1 ${collapsed ? 'md:hidden' : ''}`}>
                    {itemBadge > 99 ? '99+' : itemBadge}
                  </span>
                  {collapsed && (
                    <span className="hidden md:block absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`py-4 border-t border-white/10 space-y-0.5 ${collapsed ? 'md:px-2 px-3' : 'px-3'}`}>
        <Link
          href="/help"
          onClick={handleNavClick}
          title={collapsed ? 'Help Center' : undefined}
          className={`flex items-center gap-3 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/5 hover:text-white transition-colors
            ${collapsed ? 'md:px-0 md:py-2.5 md:justify-center px-3 py-2.5' : 'px-3 py-2.5'}`}
        >
          <HelpCircle size={18} className="text-blue-400 flex-shrink-0" />
          <span className={collapsed ? 'md:hidden' : ''}>Help Center</span>
        </Link>
        <button
          onClick={() => setShowLogoutModal(true)}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/5 hover:text-white transition-colors
            ${collapsed ? 'md:px-0 md:py-2.5 md:justify-center px-3 py-2.5' : 'px-3 py-2.5'}`}
        >
          <LogOut size={18} className="text-blue-400 flex-shrink-0" />
          <span className={collapsed ? 'md:hidden' : ''}>Logout</span>
        </button>
      </div>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={toggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-[#1a3a6b] border border-white/20 text-white hover:bg-blue-500 transition-colors absolute -right-3 top-[72px] z-10 shadow-md"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile: fixed overlay drawer */}
      <div className={`fixed inset-y-0 left-0 z-40 h-full md:hidden transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Desktop: inline sidebar */}
      <div className={`hidden md:flex h-screen flex-shrink-0 transition-all duration-200 ${collapsed ? 'w-16' : 'w-[220px]'}`}>
        {sidebarContent}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
