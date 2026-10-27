export type AqiCategory = {
  label: string;
  color: string;
  advice: string;
};

/** Faixas EPA padrão para o campo us_aqi da Open-Meteo Air Quality API. */
export function getAqiCategory(usAqi: number): AqiCategory {
  if (usAqi <= 50) {
    return { label: 'Bom', color: '#22C55E', advice: 'Qualidade do ar satisfatória.' };
  }
  if (usAqi <= 100) {
    return { label: 'Moderado', color: '#EAB308', advice: 'Aceitável para a maioria das pessoas.' };
  }
  if (usAqi <= 150) {
    return {
      label: 'Insalubre p/ grupos sensíveis',
      color: '#F97316',
      advice: 'Grupos sensíveis podem sentir efeitos.',
    };
  }
  if (usAqi <= 200) {
    return { label: 'Insalubre', color: '#EF4444', advice: 'Todos podem começar a sentir efeitos.' };
  }
  if (usAqi <= 300) {
    return { label: 'Muito insalubre', color: '#A855F7', advice: 'Alerta de saúde para toda a população.' };
  }
  return { label: 'Perigoso', color: '#7F1D1D', advice: 'Emergência sanitária — evite atividades ao ar livre.' };
}

export const POLLUTANT_LABELS: Record<string, string> = {
  pm2_5: 'PM2.5',
  pm10: 'PM10',
  ozone: 'Ozônio (O₃)',
  nitrogen_dioxide: 'Dióxido de Nitrogênio (NO₂)',
  sulphur_dioxide: 'Dióxido de Enxofre (SO₂)',
  carbon_monoxide: 'Monóxido de Carbono (CO)',
};
