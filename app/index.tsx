import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { CityHeader } from '../src/components/dashboard/CityHeader';
import { TemperatureCard } from '../src/components/dashboard/TemperatureCard';
import { EnvironmentCard } from '../src/components/dashboard/EnvironmentCard';
import { AirQualityCard } from '../src/components/dashboard/AirQualityCard';
import { DisastersCard } from '../src/components/dashboard/DisastersCard';
import { CivilAlertsCard } from '../src/components/dashboard/CivilAlertsCard';

import { useCityInfo } from '../src/hooks/useCityInfo';
import { useWeather } from '../src/hooks/useWeather';
import { useAirQuality } from '../src/hooks/useAirQuality';
import { useDisasters } from '../src/hooks/useDisasters';
import { useCivilAlerts } from '../src/hooks/useCivilAlerts';
import { LocationPermissionDeniedError } from '../src/services/location';

export default function Dashboard() {
  const cityQuery = useCityInfo();
  const coords = cityQuery.data?.coords;

  const weatherQuery = useWeather(coords);
  const airQualityQuery = useAirQuality(coords);
  const disastersQuery = useDisasters(coords);
  const civilAlertsQuery = useCivilAlerts(cityQuery.data);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      cityQuery.refetch(),
      weatherQuery.refetch(),
      airQualityQuery.refetch(),
      disastersQuery.refetch(),
      civilAlertsQuery.refetch(),
    ]);
    setIsRefreshing(false);
  }, [cityQuery, weatherQuery, airQualityQuery, disastersQuery, civilAlertsQuery]);

  const permissionDenied = cityQuery.error instanceof LocationPermissionDeniedError;

  if (cityQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#16A34A" />
        <Text className="text-gray-500 mt-3">Localizando você...</Text>
      </SafeAreaView>
    );
  }

  if (permissionDenied) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
        <Ionicons name="location-outline" size={48} color="#9CA3AF" />
        <Text className="text-lg font-bold text-brand-800 mt-4 text-center">
          Precisamos da sua localização
        </Text>
        <Text className="text-sm text-gray-500 mt-2 text-center">
          Para mostrar os dados ambientais da sua cidade, permita o acesso à localização nas
          configurações do app.
        </Text>
        <Pressable
          onPress={() => cityQuery.refetch()}
          className="mt-6 bg-brand-600 px-5 py-3 rounded-full active:opacity-80"
        >
          <Text className="text-white font-semibold">Tentar novamente</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (cityQuery.isError) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
        <Ionicons name="cloud-offline-outline" size={48} color="#9CA3AF" />
        <Text className="text-lg font-bold text-brand-800 mt-4 text-center">
          Não foi possível obter sua localização
        </Text>
        <Text className="text-sm text-gray-500 mt-2 text-center">
          Verifique sua conexão com a internet e tente novamente.
        </Text>
        <Pressable
          onPress={() => cityQuery.refetch()}
          className="mt-6 bg-brand-600 px-5 py-3 rounded-full active:opacity-80"
        >
          <Text className="text-white font-semibold">Tentar novamente</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#16A34A" />
        }
      >
        <CityHeader city={cityQuery.data} isRefreshing={isRefreshing} onRefresh={handleRefresh} />
        <View className="px-4 pt-4">
          <TemperatureCard query={weatherQuery} />
          <EnvironmentCard query={weatherQuery} />
          <AirQualityCard query={airQualityQuery} />
          <DisastersCard query={disastersQuery} cityName={cityQuery.data?.city} />
          <CivilAlertsCard query={civilAlertsQuery} />
          <Text className="text-center text-[11px] text-gray-400 mt-2">
            Dados: Open-Meteo, USGS, NASA EONET, INMET
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
