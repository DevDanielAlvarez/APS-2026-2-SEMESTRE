import type { Coordinates } from './location';

export type DisasterEvent = {
  id: string;
  type: string;
  title: string;
  time: number;
  source: 'USGS' | 'EONET';
};

async function fetchEarthquakes(coords: Coordinates): Promise<DisasterEvent[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    format: 'geojson',
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    maxradiuskm: '300',
    minmagnitude: '3',
    starttime: sevenDaysAgo,
    orderby: 'time',
  });

  const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar terremotos: ${response.status}`);
  }
  const data = await response.json();

  return (data.features ?? []).map((feature: any): DisasterEvent => ({
    id: feature.id,
    type: 'Terremoto',
    title: `Magnitude ${feature.properties.mag} — ${feature.properties.place}`,
    time: feature.properties.time,
    source: 'USGS',
  }));
}

const EONET_CATEGORY_LABELS: Record<string, string> = {
  Wildfires: 'Incêndio florestal',
  Severe_Storms: 'Tempestade severa',
  Volcanoes: 'Atividade vulcânica',
  Floods: 'Enchente',
  Drought: 'Seca',
  Landslides: 'Deslizamento de terra',
};

async function fetchEonetEvents(coords: Coordinates): Promise<DisasterEvent[]> {
  const margin = 1.5;
  const minLon = coords.longitude - margin;
  const maxLon = coords.longitude + margin;
  const minLat = coords.latitude - margin;
  const maxLat = coords.latitude + margin;
  const params = new URLSearchParams({
    status: 'open',
    days: '14',
    bbox: `${minLon},${maxLat},${maxLon},${minLat}`,
  });

  const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar eventos EONET: ${response.status}`);
  }
  const data = await response.json();

  return (data.events ?? []).map((event: any): DisasterEvent => {
    const categoryTitle = event.categories?.[0]?.id ?? event.categories?.[0]?.title ?? '';
    const lastGeometry = event.geometry?.[event.geometry.length - 1];
    return {
      id: event.id,
      type: EONET_CATEGORY_LABELS[categoryTitle] ?? event.categories?.[0]?.title ?? 'Evento natural',
      title: event.title,
      time: lastGeometry ? new Date(lastGeometry.date).getTime() : Date.now(),
      source: 'EONET',
    };
  });
}

export async function fetchNearbyDisasters(coords: Coordinates): Promise<DisasterEvent[]> {
  const results = await Promise.allSettled([fetchEarthquakes(coords), fetchEonetEvents(coords)]);

  const events = results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
  return events.sort((a, b) => b.time - a.time);
}
