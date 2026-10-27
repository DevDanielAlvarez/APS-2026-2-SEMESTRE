type WeatherInfo = {
  description: string;
  icon: keyof typeof import('@expo/vector-icons/Ionicons').default.glyphMap;
};

/** Tabela oficial WMO weather_code -> descrição pt-BR + ícone Ionicons. */
const WMO_CODES: Record<number, WeatherInfo> = {
  0: { description: 'Céu limpo', icon: 'sunny' },
  1: { description: 'Predomínio de sol', icon: 'partly-sunny' },
  2: { description: 'Parcialmente nublado', icon: 'partly-sunny' },
  3: { description: 'Nublado', icon: 'cloud' },
  45: { description: 'Neblina', icon: 'cloud' },
  48: { description: 'Neblina com geada', icon: 'cloud' },
  51: { description: 'Garoa fraca', icon: 'rainy' },
  53: { description: 'Garoa moderada', icon: 'rainy' },
  55: { description: 'Garoa forte', icon: 'rainy' },
  56: { description: 'Garoa congelante fraca', icon: 'rainy' },
  57: { description: 'Garoa congelante forte', icon: 'rainy' },
  61: { description: 'Chuva fraca', icon: 'rainy' },
  63: { description: 'Chuva moderada', icon: 'rainy' },
  65: { description: 'Chuva forte', icon: 'rainy' },
  66: { description: 'Chuva congelante fraca', icon: 'rainy' },
  67: { description: 'Chuva congelante forte', icon: 'rainy' },
  71: { description: 'Neve fraca', icon: 'snow' },
  73: { description: 'Neve moderada', icon: 'snow' },
  75: { description: 'Neve forte', icon: 'snow' },
  77: { description: 'Grãos de neve', icon: 'snow' },
  80: { description: 'Pancadas de chuva fracas', icon: 'rainy' },
  81: { description: 'Pancadas de chuva moderadas', icon: 'rainy' },
  82: { description: 'Pancadas de chuva fortes', icon: 'thunderstorm' },
  85: { description: 'Pancadas de neve fracas', icon: 'snow' },
  86: { description: 'Pancadas de neve fortes', icon: 'snow' },
  95: { description: 'Tempestade', icon: 'thunderstorm' },
  96: { description: 'Tempestade com granizo fraco', icon: 'thunderstorm' },
  99: { description: 'Tempestade com granizo forte', icon: 'thunderstorm' },
};

export function getWeatherInfo(code: number, isDay: boolean): WeatherInfo {
  const info = WMO_CODES[code] ?? { description: 'Condição desconhecida', icon: 'help-circle' };
  if (info.icon === 'sunny' && !isDay) {
    return { ...info, icon: 'moon' };
  }
  if (info.icon === 'partly-sunny' && !isDay) {
    return { ...info, icon: 'cloudy-night' };
  }
  return info;
}

export function getUvRiskLabel(uvIndex: number): { label: string; color: string } {
  if (uvIndex < 3) return { label: 'Baixo', color: '#22C55E' };
  if (uvIndex < 6) return { label: 'Moderado', color: '#EAB308' };
  if (uvIndex < 8) return { label: 'Alto', color: '#F97316' };
  if (uvIndex < 11) return { label: 'Muito Alto', color: '#EF4444' };
  return { label: 'Extremo', color: '#A855F7' };
}
