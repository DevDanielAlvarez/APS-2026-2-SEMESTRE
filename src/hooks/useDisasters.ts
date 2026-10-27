import { useQuery } from '@tanstack/react-query';
import { fetchNearbyDisasters } from '../services/disasters';
import type { Coordinates } from '../services/location';

export function useDisasters(coords: Coordinates | undefined) {
  return useQuery({
    queryKey: ['disasters', coords?.latitude, coords?.longitude],
    queryFn: () => fetchNearbyDisasters(coords as Coordinates),
    enabled: !!coords,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
