import { useQuery } from '@tanstack/react-query';
import { fetchAirQuality } from '../services/airQuality';
import type { Coordinates } from '../services/location';

export function useAirQuality(coords: Coordinates | undefined) {
  return useQuery({
    queryKey: ['airQuality', coords?.latitude, coords?.longitude],
    queryFn: () => fetchAirQuality(coords as Coordinates),
    enabled: !!coords,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
