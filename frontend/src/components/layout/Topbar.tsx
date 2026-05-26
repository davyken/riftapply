'use client';
import { useEffect, useRef, useState } from 'react';
import { Bell, HelpCircle, Menu, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { useSidebarStore } from '@/lib/store/sidebar.store';
import { useNotificationStore } from '@/lib/store/notifications.store';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useT } from '@/lib/i18n/useT';

/* Messages page per role */
const MESSAGES_HREF: Record<string, string> = {
  student:    '/student/messages',
  agent:      '/agent/messages',
  university: '/university/emails',
  admin:      '/admin/emails',
};

/* Profile page per role (null = no dedicated profile page) */
const PROFILE_HREF: Record<string, string | null> = {
  student:    null,
  agent:      '/agent/profile',
  university: '/university/profile',
  admin:      null,
};

export default function Topbar() {
  const router = useRouter();
  const { user, role, clearAuth } = useAuthStore();
  const { toggle, toggleMobile } = useSidebarStore();
  const { unreadCount, fetchCount } = useNotificationStore();

  const { T } = useT();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  /* Fetch unread count on mount, then refresh every 30 s */
  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, 30_000);
    return () => clearInterval(id);
  }, [fetchCount]);

  /* Close avatar dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function logout() {
    clearAuth();
    localStorage.removeItem('token');
    router.push('/login');
  }

  const currentRole = role || 'student';
  const messagesHref = MESSAGES_HREF[currentRole] || '/';
  const profileHref  = PROFILE_HREF[currentRole];

  const firstName = (user as any)?.firstName || (user as any)?.name?.split(' ')[0] || '';
  const lastName  = (user as any)?.lastName  || (user as any)?.name?.split(' ')[1] || '';
  const displayName = firstName ? `${firstName} ${lastName}`.trim() : (user as any)?.email || 'User';
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 flex-shrink-0">
      {/* Sidebar toggle — mobile opens overlay, desktop collapses */}
      <button
        onClick={() => {
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            toggleMobile();
          } else {
            toggle();
          }
        }}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 flex-shrink-0"
        title="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Language toggle */}
      <LanguageToggle />

      <div className="flex items-center gap-1">
        {/* Notification bell */}
        <button
          onClick={() => router.push(messagesHref)}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Help */}
        <button
          onClick={() => router.push('/help')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          title="Help Center"
        >
          <HelpCircle size={18} />
        </button>

        {/* Avatar + dropdown */}
        <div ref={avatarRef} className="relative ml-1">
          <button
            onClick={() => setAvatarOpen((o) => !o)}
            className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            title="Account"
          >
            <div className="w-7 h-7 rounded-full bg-[#1a3a6b] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <ChevronDown size={13} className={`text-gray-400 transition-transform ${avatarOpen ? 'rotate-180' : ''}`} />
          </button>

          {avatarOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1a3a6b] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                    <p className="text-[11px] text-gray-400 capitalize">{currentRole}</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="py-1">
                {profileHref && (
                  <button
                    onClick={() => { router.push(profileHref); setAvatarOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle size={15} className="text-gray-400" />
                    My Profile
                  </button>
                )}
                <button
                  onClick={() => { router.push(messagesHref); setAvatarOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Bell size={15} className="text-gray-400" />
                  <span className="flex-1 text-left">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="min-w-[18px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { router.push('/help'); setAvatarOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <HelpCircle size={15} className="text-gray-400" />
                  Help Center
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} className="text-red-400" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
