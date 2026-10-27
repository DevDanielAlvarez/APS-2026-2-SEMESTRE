import { View, Text } from 'react-native';

export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View className="px-2.5 py-1 rounded-full self-start" style={{ backgroundColor: `${color}20` }}>
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
