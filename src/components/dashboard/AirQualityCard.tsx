import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { CardSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { getAqiCategory, POLLUTANT_LABELS } from '../../utils/aqiCategory';
import type { AirQualityData } from '../../services/airQuality';
import type { UseQueryResult } from '@tanstack/react-query';

const POLLUTANT_KEYS: (keyof AirQualityData)[] = [
  'pm2_5',
  'pm10',
  'ozone',
  'nitrogen_dioxide',
  'sulphur_dioxide',
  'carbon_monoxide',
];

export function AirQualityCard({ query }: { query: UseQueryResult<AirQualityData> }) {
  const { data, isLoading, isError, refetch } = query;

  return (
    <Card title="Qualidade do Ar" icon={<Ionicons name="cloud-outline" size={18} color="#0EA5E9" />}>
      {isLoading ? (
        <CardSkeleton />
      ) : isError || !data ? (
        <ErrorState message="Não foi possível carregar a qualidade do ar." onRetry={refetch} />
      ) : (
        <View>
          <View className="flex-row items-center mb-4">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: `${getAqiCategory(data.usAqi).color}20` }}
            >
              <Text className="text-2xl font-bold" style={{ color: getAqiCategory(data.usAqi).color }}>
                {Math.round(data.usAqi)}
              </Text>
              <Text className="text-[10px] text-gray-500">AQI</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold" style={{ color: getAqiCategory(data.usAqi).color }}>
                {getAqiCategory(data.usAqi).label}
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">{getAqiCategory(data.usAqi).advice}</Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {POLLUTANT_KEYS.map((key) => (
              <View key={key} className="bg-gray-50 rounded-lg px-2.5 py-1.5" style={{ width: '31%' }}>
                <Text className="text-[10px] text-gray-500" numberOfLines={1}>
                  {POLLUTANT_LABELS[key]}
                </Text>
                <Text className="text-sm font-semibold text-black">{Math.round(data[key])} µg/m³</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
}
