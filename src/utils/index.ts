import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const FieldRequireMessage = 'Энэ талбарыг оруулах шаардлагатай!';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatThousandSeparator(value?: number | string) {
  if (!value) return '0';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatThousandSeparatorShow(value?: number | string) {
  if (value === undefined || value === null || value === '') return '0';
  const parts = value.toString().split('.');
  const integerPart = Number(parts[0]).toLocaleString('en-US');
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
}

export function formatSeparator2(value?: number | string) {
  if (!value) return '0';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatThousandSeparator5(value?: number | string) {
  if (!value) return '0';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

export function formatMoney(value?: string | number, currency?: string | null) {
  if (value === null || value === undefined || value === '') return '0.00';
  const numValue =
    typeof value === 'string' ? Number.parseFloat(value) : Number(value);
  if (Number.isNaN(numValue)) return '0.00';
  const formatted = numValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? currency + ' ' + formatted : formatted;
}

export function formatAddress(address: string) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}

export function formatMoneyWithCoin(
  value?: string,
  currency = '₮',
  fractionDigits = 4,
) {
  if (!value) return '0.00';
  const formatted = Number(value).toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return currency + ' ' + formatted;
}

export const cutDecimal = (number: number, count: number) => {
  const arr = number?.toString().split('.');
  const decimal = arr?.[1] == undefined ? 0 : arr?.[1]?.substring(0, count);
  return arr?.[0] + '.' + decimal;
};

export const maskedValue = (value?: string) => {
  if (!value) return '';
  const firstPart = value?.slice(0, 3);
  const lastPart = value?.slice(-4);
  return firstPart + '****' + lastPart;
};
