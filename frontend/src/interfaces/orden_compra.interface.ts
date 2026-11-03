export type MetodoPago = 'TARJETA_CREDITO' | 'TARJETA_DEBITO';
export type EstadoOrdenCompra = 'PENDIENTE' | 'PAGADO' | 'CANCELADO' | 'FALLIDO' | 'REEMBOLSADO';

/**
 * Estructura de Orden de Compra
 * Representa una compra de tickets por parte de un asistente
 * 
 * Nota: El campo 'monto' es NUMERIC(10, 0) en la BD (sin decimales, en pesos chilenos)
 * PostgreSQL lo retorna como string, pero siempre será un número entero
 */
export interface OrdenCompra {
  id: number;
  fecha_compra: string; // ISO date string
  monto: number | string; // String del backend (NUMERIC), convertir a number para cálculos
  metodo_pago: MetodoPago;
  estado: EstadoOrdenCompra;
  id_asistente: number;
}

/**
 * Orden de compra con información enriquecida
 * Puede incluir datos adicionales como cantidad de tickets, festival, etc.
 */
export interface OrdenCompraEnriquecida extends OrdenCompra {
  cantidad_tickets?: number;
  festival_nombre?: string;
}
