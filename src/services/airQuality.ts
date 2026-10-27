import type { Coordinates } from './location';

export type AirQualityData = {
  usAqi: number;
  pm2_5: number;
  pm10: number;
  ozone: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
  carbon_monoxide: number;
};

export async function fetchAirQuality(coords: Coordinates): Promise<AirQualityData> {
  const params = new URLSearchParams({
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    current: 'us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide',
  });

  const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar qualidade do ar: ${response.status}`);
  }
  const data = await response.json();

  return {
    usAqi: data.current.us_aqi,
    pm2_5: data.current.pm2_5,
    pm10: data.current.pm10,
    ozone: data.current.ozone,
    nitrogen_dioxide: data.current.nitrogen_dioxide,
    sulphur_dioxide: data.current.sulphur_dioxide,
    carbon_monoxide: data.current.carbon_monoxide,
  };
}
