export interface Stat {
  label: string;
  value: string;
  numericTarget: number;
  suffix: string;
  description: string;
  icon: string;
  accent: 'primary' | 'secondary';
}

export interface StatsSection {
  tagline: string;
  title: string;
  description: string;
  footnote: string;
  items: Stat[];
}

export const statsSectionData: StatsSection = {
  tagline: 'NUESTRA HUELLA EN NÚMEROS',
  title: 'Cifras que respaldan nuestro compromiso',
  description:
    'Más que métricas, representan el ritmo pausado y la confianza de una comunidad que valora el grano honesto y la fermentación sin prisas.',
  footnote:
    'Métricas registradas y verificadas en nuestro salón y terraza de Altamira desde 2018.',
  items: [
    {
      label: 'Trayectoria',
      value: '8+',
      numericTarget: 8,
      suffix: '+',
      description: 'Años perfeccionando tuestes artesanales y fermentaciones vivas en Caracas.',
      icon: 'history_edu',
      accent: 'primary',
    },
    {
      label: 'Propuesta',
      value: '35+',
      numericTarget: 35,
      suffix: '+',
      description: 'Recetas de temporada, fermentos de masa madre y cafés de origen ético.',
      icon: 'skillet',
      accent: 'secondary',
    },
    {
      label: 'Satisfacción',
      value: '4,9',
      numericTarget: 4.9,
      suffix: ' ★',
      description: 'Calificación promedio en Google Maps y guías gastronómicas de la ciudad.',
      icon: 'grade',
      accent: 'primary',
    },
    {
      label: 'Comunidad',
      value: '85%',
      numericTarget: 85,
      suffix: '%',
      description: 'De comensales habituales que regresan cada semana a compartir mesa.',
      icon: 'favorite',
      accent: 'secondary',
    },
  ],
};

export const stats: Stat[] = statsSectionData.items;
