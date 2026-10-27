import { View, Text, type ViewProps } from 'react-native';

type CardProps = ViewProps & {
  title?: string;
  icon?: React.ReactNode;
};

export function Card({ title, icon, children, className, ...rest }: CardProps) {
  return (
    <View
      className={`mb-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 ${className ?? ''}`}
      {...rest}
    >
      {title ? (
        <View className="flex-row items-center mb-3">
          {icon}
          <Text className="text-base font-bold text-black ml-2">{title}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}
