/**
 * Mapeamento simplificado estado (UF/nome) -> termos de região usados nos
 * textos de "Área" dos avisos do INMET (mesorregiões, nomes de estado ou
 * "Estado de <nome>"). Não é exaustivo: o objetivo é casar por substring
 * contra o texto livre do feed, não fazer geocodificação precisa.
 */
export const STATE_NAME_BY_UF: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
};

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/**
 * Recebe o nome do estado (ex.: vindo do BigDataCloud `principalSubdivision`,
 * que costuma vir por extenso) e retorna termos de busca para casar contra
 * o texto de "Área" de um item do feed INMET.
 */
export function getRegionSearchTerms(stateNameOrUf: string): string[] {
  const trimmed = stateNameOrUf.trim();
  const byUf = STATE_NAME_BY_UF[trimmed.toUpperCase()];
  const fullName = byUf ?? trimmed;
  return [normalize(fullName)];
}

export function areaMatchesState(areaText: string, stateNameOrUf: string): boolean {
  const normalizedArea = normalize(areaText);
  return getRegionSearchTerms(stateNameOrUf).some((term) => normalizedArea.includes(term));
}
