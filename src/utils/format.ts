/**
 * Utilidades de formato numérico y monetario con estándar de Venezuela (es-VE).
 */

const venezuelaCurrencyFormatter = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const venezuelaNumberFormatter = new Intl.NumberFormat('es-VE');

const venezuelaRatingFormatter = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * Formatea un valor monetario en dólares con coma decimal venezolana: "$8,50".
 */
export function formatPrice(amount: number): string {
  return `$${venezuelaCurrencyFormatter.format(amount)}`;
}

/**
 * Formatea un número entero o decimal con separador de miles venezolano: "1.200".
 */
export function formatNumber(value: number): string {
  return venezuelaNumberFormatter.format(value);
}

/**
 * Formatea un valor de calificación con coma decimal venezolana: "4,9".
 */
export function formatRating(value: number): string {
  return venezuelaRatingFormatter.format(value);
}
