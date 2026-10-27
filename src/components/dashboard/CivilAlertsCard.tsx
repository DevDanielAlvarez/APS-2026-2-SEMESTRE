import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { CardSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import type { CivilAlertsResult } from '../../services/civilAlerts';
import type { UseQueryResult } from '@tanstack/react-query';

export function CivilAlertsCard({ query }: { query: UseQueryResult<CivilAlertsResult> }) {
  const { data, isLoading, isError, refetch } = query;

  return (
    <Card title="Alertas Civis" icon={<Ionicons name="megaphone-outline" size={18} color="#F97316" />}>
      {isLoading ? (
        <CardSkeleton />
      ) : isError ? (
        <ErrorState message="Não foi possível carregar alertas civis." onRetry={refetch} />
      ) : !data || data.status === 'unavailable-region' ? (
        <View className="items-center py-3">
          <Ionicons name="information-circle-outline" size={28} color="#9CA3AF" />
          <Text className="text-sm text-gray-500 mt-2 text-center">
            Alertas civis não disponíveis nesta região.
          </Text>
        </View>
      ) : data.alerts.length === 0 ? (
        <View className="items-center py-3">
          <Ionicons name="shield-checkmark" size={28} color="#16A34A" />
          <Text className="text-sm text-gray-500 mt-2 text-center">Nenhum alerta ativo na sua região.</Text>
        </View>
      ) : (
        <View className="gap-2.5">
          {data.alerts.slice(0, 5).map((alert) => (
            <View key={alert.id} className="bg-orange-50 rounded-lg px-3 py-2">
              <Text className="text-xs font-bold text-orange-700">{alert.severity}</Text>
              <Text className="text-xs text-gray-700 mt-0.5" numberOfLines={3}>
                {alert.title}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}
