import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { CardSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import type { DisasterEvent } from '../../services/disasters';
import type { UseQueryResult } from '@tanstack/react-query';

export function DisastersCard({ query, cityName }: { query: UseQueryResult<DisasterEvent[]>; cityName?: string }) {
  const { data, isLoading, isError, refetch } = query;

  return (
    <Card title="Desastres Naturais" icon={<Ionicons name="warning-outline" size={18} color="#F59E0B" />}>
      {isLoading ? (
        <CardSkeleton />
      ) : isError ? (
        <ErrorState message="Não foi possível verificar desastres próximos." onRetry={refetch} />
      ) : !data || data.length === 0 ? (
        <View className="items-center py-3">
          <Ionicons name="shield-checkmark" size={28} color="#16A34A" />
          <Text className="text-sm text-gray-500 mt-2 text-center">
            Nenhum desastre ativo perto de {cityName ?? 'você'}.
          </Text>
        </View>
      ) : (
        <View className="gap-2.5">
          {data.slice(0, 5).map((event) => (
            <View key={event.id} className="flex-row items-start bg-orange-50 rounded-lg px-3 py-2">
              <Ionicons name="alert-circle" size={16} color="#F97316" style={{ marginTop: 2 }} />
              <View className="flex-1 ml-2">
                <Text className="text-xs font-semibold text-black">{event.type}</Text>
                <Text className="text-xs text-gray-500" numberOfLines={2}>
                  {event.title}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}
