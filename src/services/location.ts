import * as Location from 'expo-location';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type CityInfo = {
  city: string;
  state: string;
  countryName: string;
  countryCode: string;
  coords: Coordinates;
};

export class LocationPermissionDeniedError extends Error {
  constructor() {
    super('Permissão de localização negada');
    this.name = 'LocationPermissionDeniedError';
  }
}

export async function getCurrentCoordinates(): Promise<Coordinates> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new LocationPermissionDeniedError();
  }
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { latitude: position.coords.latitude, longitude: position.coords.longitude };
}

export async function reverseGeocode(coords: Coordinates): Promise<CityInfo> {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=pt`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao buscar localização: ${response.status}`);
  }
  const data = await response.json();
  return {
    city: data.city || data.locality || 'Localização desconhecida',
    state: data.principalSubdivision ?? '',
    countryName: data.countryName ?? '',
    countryCode: data.countryCode ?? '',
    coords,
  };
}

export async function getCurrentCityInfo(): Promise<CityInfo> {
  const coords = await getCurrentCoordinates();
  return reverseGeocode(coords);
}
