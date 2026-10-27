import { useQuery } from '@tanstack/react-query';
import { getCurrentCityInfo } from '../services/location';

export function useCityInfo() {
  return useQuery({
    queryKey: ['cityInfo'],
    queryFn: getCurrentCityInfo,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
