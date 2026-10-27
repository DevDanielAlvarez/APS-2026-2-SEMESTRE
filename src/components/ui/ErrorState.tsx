import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ErrorState({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <View className="items-center py-2">
      <Ionicons name="alert-circle-outline" size={28} color="#EF4444" />
      <Text className="text-sm text-gray-500 mt-1 text-center">
        {message ?? 'Não foi possível carregar esses dados.'}
      </Text>
      <Pressable
        onPress={onRetry}
        className="mt-2 flex-row items-center bg-brand-50 px-3 py-1.5 rounded-full active:opacity-70"
      >
        <Ionicons name="refresh" size={14} color="#15803D" />
        <Text className="text-brand-700 text-xs font-semibold ml-1">Tentar novamente</Text>
      </Pressable>
    </View>
  );
}
