import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { CardSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { getWeatherInfo } from '../../utils/weatherCode';
import type { WeatherData } from '../../services/weather';
import type { UseQueryResult } from '@tanstack/react-query';

export function TemperatureCard({ query }: { query: UseQueryResult<WeatherData> }) {
  const { data, isLoading, isError, refetch } = query;

  return (
    <Card>
      {isLoading ? (
        <CardSkeleton />
      ) : isError || !data ? (
        <ErrorState message="Não foi possível carregar a temperatura." onRetry={refetch} />
      ) : (
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-5xl font-bold text-black">{Math.round(data.temperature)}°C</Text>
            <Text className="text-gray-500 mt-1">
              {getWeatherInfo(data.weatherCode, data.isDay).description}
            </Text>
            <Text className="text-gray-400 text-xs mt-0.5">
              Sensação térmica {Math.round(data.apparentTemperature)}°C
            </Text>
          </View>
          <View className="w-16 h-16 rounded-full bg-amber-50 items-center justify-center">
            <Ionicons name={getWeatherInfo(data.weatherCode, data.isDay).icon} size={36} color="#F59E0B" />
          </View>
        </View>
      )}
    </Card>
  );
}
