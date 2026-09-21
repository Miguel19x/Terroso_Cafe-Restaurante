export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  dishFavorite?: string;
  verified?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Gabriela Peñaloza',
    role: 'Periodista Gastronómica',
    dishFavorite: 'Pan de masa madre & café filtrado',
    verified: true,
    quote:
      'El mejor café de especialidad que he tomado en Caracas. El pan de masa madre recién salido del horno con mantequilla de campo batida a mano es sencillamente extraordinario.',
  },
  {
    name: 'Andrés Villasmil',
    role: 'Arquitecto & Diseñador',
    dishFavorite: 'Tostada Terroso con huevos de corral',
    verified: true,
    quote:
      'Un respiro total en medio del ritmo de la ciudad. La luz matutina que entra por los ventanales, la calidez de la madera y el brunch son mi ritual sagrado de cada sábado en Altamira.',
  },
  {
    name: 'Carolina Montilla',
    role: 'Catadora de Café & Sommelier',
    dishFavorite: 'Café Táchira V60 Origen Único',
    verified: true,
    quote:
      'Se nota el amor por el detalle en cada taza servida. Los baristas conocen a fondo el origen de cada lote del Táchira y te transportan directamente a las montañas andinas venezolanas.',
  },
];

