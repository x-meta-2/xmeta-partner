import { createServerFn } from '@tanstack/react-start';
import type { Country } from './types';

export type { Country } from './types';

export const fetchSupportedCountries = createServerFn({
  method: 'GET',
}).handler(async () => {
  const response = await fetch(
    'https://www.x-meta.com/api/config/supportedCountries',
  );
  const json = await response.json();
  const rawData: Country[] = json.data || [];
  return rawData
    .filter((item) => {
      const hasName = !!item.name;
      const isNotBroken = item.emoji && !item.emoji.includes('�');
      return hasName && isNotBroken;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
});
