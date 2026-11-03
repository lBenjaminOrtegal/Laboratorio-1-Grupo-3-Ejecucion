export type EstadoTicket = 'VALIDO' | 'UTILIZADO' | 'ANULADO';

/**
 * Estructura base del ticket (sincronizado con backend)
 * Representa un ticket en el sistema
 */
export interface Ticket {
  id: number;
  id_orden_compra: number;
  estado: EstadoTicket;
  codigo_unico: string;
  fecha_uso: string | null;
  id_tipo_entrada: number;
}

/**
 * Ticket enriquecido con información adicional
 * Útil para vistas que necesiten contexto del ticket (qué tipo, qué festival, etc.)
 * Los campos adicionales se obtienen desde el backend mediante JOINs
 */
export interface TicketEnriquecido extends Ticket {
  tipo_entrada_nombre?: string; // Del backend JOIN con tipo_entrada
  festival?: string;
  fecha_acceso?: string;
}

/**
 * Resultado de la validación de un ticket en control de acceso
 * Alineado con la respuesta real del backend - puede incluir campos enriquecidos
 */
export interface TicketValidationResult {
  success: boolean;
  message: string;
  data?: Ticket & { tipo_entrada_nombre?: string };  // Ticket enriquecido del backend
  error?: string;
  status?: number;
}

/**
 * DTO para crear nuevos tickets
 * - estado: opcional, se asigna 'VALIDO' por defecto
 * - fecha_uso: opcional, se asigna automáticamente si estado es 'UTILIZADO'
 */
export interface CreateTicketDTO {
  id_orden_compra: number;
  estado?: EstadoTicket;
  codigo_unico: string;
  fecha_uso?: string;
  id_tipo_entrada: number;
}

/**
 * DTO para actualizar tickets existentes
 * Alineado con el backend (permite actualizar todos los campos del ticket)
 * Nota: El backend solo permite actualizar tickets en estado 'VALIDO' sin fecha_uso
 */
export interface UpdateTicketDTO {
  estado?: EstadoTicket;
  codigo_unico?: string;
  fecha_uso?: string;
  id_tipo_entrada?: number;
}