import { View } from 'react-native';

export function Skeleton({ height = 16, width = '100%' }: { height?: number; width?: number | `${number}%` }) {
  return <View className="rounded-md bg-brand-100 animate-pulse" style={{ height, width }} />;
}

export function CardSkeleton() {
  return (
    <View className="gap-2">
      <Skeleton height={14} width="40%" />
      <Skeleton height={28} width="60%" />
      <Skeleton height={14} width="80%" />
    </View>
  );
}
