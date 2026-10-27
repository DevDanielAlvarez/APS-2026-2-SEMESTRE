import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { CardSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { Badge } from '../ui/Badge';
import { getUvRiskLabel } from '../../utils/weatherCode';
import type { WeatherData } from '../../services/weather';
import type { UseQueryResult } from '@tanstack/react-query';

function StatItem({
  icon,
  color,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View className="items-center flex-1">
      <Ionicons name={icon} size={22} color={color} />
      <Text className="text-base font-bold text-black mt-1">{value}</Text>
      <Text className="text-xs text-gray-500">{label}</Text>
    </View>
  );
}

function formatTime(iso?: string): string {
  if (!iso) return '--:--';
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function EnvironmentCard({ query }: { query: UseQueryResult<WeatherData> }) {
  const { data, isLoading, isError, refetch } = query;

  return (
    <Card title="Ambiente" icon={<Ionicons name="leaf" size={18} color="#0EA5E9" />}>
      {isLoading ? (
        <CardSkeleton />
      ) : isError || !data ? (
        <ErrorState message="Não foi possível carregar os dados do ambiente." onRetry={refetch} />
      ) : (
        <View>
          <View className="flex-row justify-between mb-4">
            <StatItem icon="water" color="#0EA5E9" label="Umidade" value={`${Math.round(data.humidity)}%`} />
            <StatItem icon="navigate" color="#64748B" label="Vento" value={`${Math.round(data.windSpeed)} km/h`} />
            <StatItem icon="sunny" color="#F59E0B" label="Nascer do sol" value={formatTime(data.sunrise)} />
            <StatItem icon="moon" color="#6366F1" label="Pôr do sol" value={formatTime(data.sunset)} />
          </View>
          <View className="flex-row items-center justify-between bg-amber-50 rounded-xl px-3 py-2">
            <Text className="text-sm text-black font-medium">Índice UV: {data.uvIndex.toFixed(1)}</Text>
            <Badge {...getUvRiskLabel(data.uvIndex)} />
          </View>
        </View>
      )}
    </Card>
  );
}
