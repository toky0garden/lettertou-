import type { Dictionary, Locale } from './types';
import { en } from './en';
import { ru } from './ru';

/**
 * Central locale registry. Russian is the source language (and the app default —
 * see <html lang="ru"> in the root layout); English mirrors it key-for-key.
 *
 * Usage:
 *   import { getDictionary } from '@/locales';
 *   const t = getDictionary('ru');
 *   t.home.popular.title; // "Популярное"
 *
 * Interpolation placeholders like "{count}" follow the react-intl / ICU syntax so
 * the strings can later be fed to <FormattedMessage> without rewriting.
 */
export const DEFAULT_LOCALE: Locale = 'ru';

export const LOCALES: readonly Locale[] = ['ru', 'en'] as const;

export const LOCALE_NAMES: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English'
};

export const dictionaries: Record<Locale, Dictionary> = {
  ru,
  en
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export type { Dictionary, Locale } from './types';
export { en } from './en';
export { ru } from './ru';
