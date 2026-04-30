/**
 * "YYYY-MM-DD" — locale-stable date label for table columns and detail
 * fields. Returns "-" for missing or unparseable input so callers don't
 * have to guard against the `RangeError` that `toISOString()` throws on
 * `Invalid Date`.
 */
export function formatDate(iso?: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '-' : d.toISOString().slice(0, 10);
}

/**
 * "YYYY-MM-DD HH:mm" — same safety guarantees as {@link formatDate}, but
 * keeps the time portion (UTC) for activity feeds. Locale-stable so SSR
 * hydration doesn't flicker across the user's timezone.
 */
export function formatDateTime(iso?: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
}

/**
 * "April 28, 2026" — long English date for profile fields ("Member since",
 * "Approved at", etc.). Uses the browser locale so dev tools display
 * naturally; for table rows prefer {@link formatDate} which is timezone-
 * stable across SSR ↔ client.
 */
export function formatLongDate(iso?: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
