import { useQuery } from '@tanstack/react-query';
import { fetchCivilAlerts } from '../services/civilAlerts';
import type { CityInfo } from '../services/location';

export function useCivilAlerts(city: CityInfo | undefined) {
  return useQuery({
    queryKey: ['civilAlerts', city?.countryCode, city?.state],
    queryFn: () => fetchCivilAlerts(city as CityInfo),
    enabled: !!city,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
