'use client';
import { useLanguageStore } from '@/lib/store/language.store';

interface Props {
  /** 'pill' = compact flag+code pill (default), 'full' = wider with label */
  variant?: 'pill' | 'full';
  /** Extra Tailwind classes */
  className?: string;
}

export default function LanguageToggle({ variant = 'pill', className = '' }: Props) {
  const { lang, toggle } = useLanguageStore();

  const isFr = lang === 'fr';

  if (variant === 'full') {
    return (
      <button
        onClick={toggle}
        title={isFr ? 'Switch to English' : 'Passer en français'}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors shadow-sm ${className}`}
      >
        <span className="text-base leading-none">{isFr ? '🇬🇧' : '🇫🇷'}</span>
        <span>{isFr ? 'English' : 'Français'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      title={isFr ? 'Switch to English' : 'Passer en français'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-600 transition-colors ${className}`}
    >
      <span className="text-sm leading-none">{isFr ? '🇬🇧' : '🇫🇷'}</span>
      <span>{isFr ? 'EN' : 'FR'}</span>
    </button>
  );
}
