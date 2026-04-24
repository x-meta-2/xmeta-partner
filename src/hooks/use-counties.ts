import { useQuery } from '@tanstack/react-query';
import { fetchSupportedCountries } from '#/services/apis/config/country';

export const useCountries = () => {
  return useQuery({
    queryKey: ['supportedCountries'],
    queryFn: async () => {
      const data = await fetchSupportedCountries();
      return data;
    },
  });
};
