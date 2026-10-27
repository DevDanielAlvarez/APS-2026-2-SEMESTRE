import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CityInfo } from '../../services/location';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function CityHeader({
  city,
  isRefreshing,
  onRefresh,
}: {
  city?: CityInfo;
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <View className="bg-brand-600 rounded-b-3xl px-5 pt-4 pb-6 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-brand-100 text-sm font-medium">{getGreeting()}</Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="location" size={20} color="#F0FDF4" />
          <Text className="text-white text-xl font-bold ml-1" numberOfLines={1}>
            {city ? `${city.city}${city.state ? `, ${city.state}` : ''}` : 'Localizando...'}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={onRefresh}
        disabled={isRefreshing}
        className="w-10 h-10 rounded-full bg-brand-500 items-center justify-center active:opacity-70"
      >
        <Ionicons name="refresh" size={20} color="#FFFFFF" style={isRefreshing ? { opacity: 0.5 } : undefined} />
      </Pressable>
    </View>
  );
}
