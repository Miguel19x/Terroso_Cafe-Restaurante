/**
 * Configuración global y fuente única de verdad para Terroso Café & Restaurante.
 */

export interface ScheduleRange {
  days: string;
  shortDays: string;
  opens: string;
  closes: string;
  formatted: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    postalCode: string;
    country: string;
    full: string;
    mapsUrl: string;
  };
  contact: {
    // Número ficticio obvio para fines de demostración en portafolio (código 212 Caracas)
    phoneDisplay: string;
    phoneRaw: string;
    // Número ficticio para el enlace interactivo de WhatsApp
    whatsappNumber: string;
    whatsappDefaultMessage: string;
    email: string;
    instagramUrl: string;
  };
  schedule: {
    weekdays: ScheduleRange;
    weekends: ScheduleRange;
  };
}

export const siteConfig: SiteConfig = {
  name: 'Terroso',
  tagline: 'Café de Especialidad & Cocina de Origen',
  description:
    'Ingredientes de origen venezolano, panadería artesanal de masa madre y café del Táchira seleccionado con pasión. Una pausa cálida en el corazón de Altamira, Caracas.',
  address: {
    street: 'Av. Luis Roche, Torre Empresarial, PB',
    neighborhood: 'Altamira',
    city: 'Caracas',
    postalCode: '1060',
    country: 'Venezuela',
    full: 'Av. Luis Roche, Torre Empresarial, PB, Altamira, Caracas 1060, Venezuela',
    mapsUrl: 'https://maps.google.com/?q=Altamira+Caracas',
  },
  contact: {
    // Teléfono ficticio de demostración para portafolio (no pertenece a un particular o negocio real)
    phoneDisplay: '+58 212 000-0000',
    phoneRaw: '+582120000000',
    whatsappNumber: '584120000000',
    whatsappDefaultMessage: 'Hola Terroso, quisiera consultar información sobre una reserva',
    email: 'reservas@cafeterroso.com.ve',
    instagramUrl: 'https://instagram.com',
  },
  schedule: {
    weekdays: {
      days: 'Lunes a Viernes',
      shortDays: 'L-V',
      opens: '07:30',
      closes: '20:30',
      formatted: '07:30 – 20:30 hs',
    },
    weekends: {
      days: 'Sábados y Domingos',
      shortDays: 'S-D',
      opens: '08:30',
      closes: '21:30',
      formatted: '08:30 – 21:30 hs',
    },
  },
};

/**
 * Calcula el horario correspondiente a la fecha actual evaluada en el huso
 * horario de Caracas ('America/Caracas') para clientes estáticos.
 */
export function getCaracasTodaySchedule(): { dayName: string; formattedHours: string } {
  const now = new Date();

  // Obtenemos el nombre del día en español con zona horaria de Caracas
  const dayNameFormatter = new Intl.DateTimeFormat('es-VE', {
    timeZone: 'America/Caracas',
    weekday: 'long',
  });
  const dayName = dayNameFormatter.format(now);

  // Evaluamos si en Caracas es sábado o domingo
  const dayOfWeekParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Caracas',
    weekday: 'short',
  }).format(now);

  const isWeekend = dayOfWeekParts === 'Sat' || dayOfWeekParts === 'Sun';
  const scheduleRange = isWeekend ? siteConfig.schedule.weekends : siteConfig.schedule.weekdays;

  return {
    dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
    formattedHours: scheduleRange.formatted,
  };
}
