import { XMLParser } from 'fast-xml-parser';
import type { CityInfo, Coordinates } from './location';
import { areaMatchesState } from '../utils/brRegions';

export type CivilAlert = {
  id: string;
  title: string;
  description: string;
  severity: string;
};

export type CivilAlertsResult =
  | { status: 'available'; alerts: CivilAlert[] }
  | { status: 'unavailable-region' };

const INMET_USER_AGENT = 'Mozilla/5.0 (compatible; DashboardAmbiental/1.0)';

function extractSeverity(title: string): string {
  if (/grande perigo/i.test(title)) return 'Grande Perigo';
  if (/^perigo/i.test(title) || / perigo /i.test(title)) return 'Perigo';
  return 'Perigo Potencial';
}

async function fetchInmetAlerts(state: string): Promise<CivilAlert[]> {
  const response = await fetch('https://apiprevmet3.inmet.gov.br/avisos/rss', {
    headers: { 'User-Agent': INMET_USER_AGENT },
  });
  if (!response.ok) {
    throw new Error(`Falha ao buscar avisos do INMET: ${response.status}`);
  }
  const xmlText = await response.text();

  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xmlText);
  const items: any[] = parsed?.rss?.channel?.item ?? [];
  const itemList = Array.isArray(items) ? items : [items];

  return itemList
    .filter((item) => {
      const area = item?.['inmet:area'] ?? item?.area ?? item?.description ?? '';
      return state ? areaMatchesState(String(area), state) : true;
    })
    .map((item, index) => {
      const title = String(item?.title ?? 'Aviso meteorológico');
      return {
        id: String(item?.guid ?? `${title}-${index}`),
        title,
        description: String(item?.description ?? ''),
        severity: extractSeverity(title),
      };
    });
}

async function fetchNwsAlerts(coords: Coordinates): Promise<CivilAlert[]> {
  const response = await fetch(`https://api.weather.gov/alerts/active?point=${coords.latitude},${coords.longitude}`, {
    headers: { 'User-Agent': INMET_USER_AGENT, Accept: 'application/geo+json' },
  });
  if (!response.ok) {
    throw new Error(`Falha ao buscar alertas NWS: ${response.status}`);
  }
  const data = await response.json();

  return (data.features ?? []).map((feature: any): CivilAlert => ({
    id: feature.id,
    title: feature.properties.headline ?? feature.properties.event,
    description: feature.properties.description ?? '',
    severity: feature.properties.severity ?? 'Aviso',
  }));
}

export async function fetchCivilAlerts(city: CityInfo): Promise<CivilAlertsResult> {
  if (city.countryCode === 'BR') {
    const alerts = await fetchInmetAlerts(city.state);
    return { status: 'available', alerts };
  }
  if (city.countryCode === 'US') {
    const alerts = await fetchNwsAlerts(city.coords);
    return { status: 'available', alerts };
  }
  return { status: 'unavailable-region' };
}
