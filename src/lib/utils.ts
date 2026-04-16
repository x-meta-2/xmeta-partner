import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build the page-number list for a paginator with ellipses.
 *
 * Examples:
 *   getPageNumbers(1, 5)   → [1, 2, 3, 4, 5]
 *   getPageNumbers(5, 20)  → [1, '...', 4, 5, 6, '...', 20]
 *   getPageNumbers(1, 1)   → [1]
 */
export function getPageNumbers(
  current: number,
  total: number,
): Array<number | '...'> {
  if (total <= 1) return [1];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: Array<number | '...'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  pages.push(total);

  return pages;
}
