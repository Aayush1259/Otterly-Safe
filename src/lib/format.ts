import type { Lang } from '../types';

const TZ = 'America/Los_Angeles';

export function money(n: number, cents = false): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

/** "4:10 pm" — always in Pacific time so the demo is identical on any laptop. */
export function clock(iso: string, lang: Lang = 'en'): string {
  const s = new Intl.DateTimeFormat(lang === 'es' ? 'es-US' : 'en-US', {
    timeZone: TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
  return s.replace(/\s?AM/i, ' am').replace(/\s?PM/i, ' pm').replace(/\u202f/g, ' ').replace(/\s?a\.\s?m\./i, ' a. m.').replace(/\s?p\.\s?m\./i, ' p. m.');
}

/** "Oct 3" */
export function shortDate(iso: string, lang: Lang = 'en'): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-US' : 'en-US', {
    timeZone: TZ,
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso.length === 10 ? `${iso}T12:00:00-07:00` : iso));
}

/** "2026-10-18 10:42" — for staff console / data drawer (monospace). */
export function stamp(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const hour = get('hour') === '24' ? '00' : get('hour');
  return `${get('year')}-${get('month')}-${get('day')} ${hour}:${get('minute')}`;
}

export function minutesBetween(aIso: string, bIso: string): number {
  return Math.round((new Date(bIso).getTime() - new Date(aIso).getTime()) / 60000);
}

export function ago(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = minutes / 60;
  if (h < 48) return `${Math.round(h)} h`;
  return `${Math.round(h / 24)} days`;
}
