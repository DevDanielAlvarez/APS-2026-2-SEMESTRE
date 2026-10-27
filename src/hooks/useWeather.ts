import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '../services/weather';
import type { Coordinates } from '../services/location';

export function useWeather(coords: Coordinates | undefined) {
  return useQuery({
    queryKey: ['weather', coords?.latitude, coords?.longitude],
    queryFn: () => fetchWeather(coords as Coordinates),
    enabled: !!coords,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
