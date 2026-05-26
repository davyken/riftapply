'use client';
import { useLanguageStore } from '@/lib/store/language.store';
import t, { tr } from './translations';

/**
 * Returns a translator function `T(node)` that picks the right language.
 *
 * Usage:
 *   const { T, lang } = useT();
 *   <h1>{T(t.hero.title1)}</h1>
 */
export function useT() {
  const lang = useLanguageStore((s) => s.lang);
  const T = (node: { en: string; fr: string }) => tr(node, lang);
  return { T, lang, t };
}
