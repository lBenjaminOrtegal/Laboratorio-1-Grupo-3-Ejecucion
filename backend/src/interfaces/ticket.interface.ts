export type EstadoTicket = 'VALIDO' | 'UTILIZADO' | 'ANULADO';

/**
 * Estructura base del ticket (sincronizado con BD)
 * Todos los campos son requeridos cuando se devuelve del backend
 */
export interface Ticket {
    id: number;
    id_orden_compra: number;
    estado: EstadoTicket;
    codigo_unico: string;
    fecha_uso: string | null; // String porque viene de JSON de PostgreSQL
    id_tipo_entrada: number;
}

/**
 * Ticket enriquecido con información del tipo de entrada
 * Usado en endpoints que retornan datos para el usuario (como mis-tickets)
 */
export interface TicketEnriquecido extends Ticket {
    tipo_entrada_nombre?: string;
}

/**
 * DTO para crear nuevos tickets
 * - estado: opcional, por defecto 'VALIDO' (asignado en repositorio)
 * - fecha_uso: opcional, se asigna automáticamente si estado es 'UTILIZADO'
 */
export interface CreateTicketDTO {
    id_orden_compra: number;
    estado?: EstadoTicket;
    codigo_unico: string;
    fecha_uso?: string | null;
    id_tipo_entrada: number;
}

/**
 * DTO para actualizar tickets existentes
 * - Solo se pueden actualizar tickets en estado 'VALIDO' sin fecha_uso
 */
export interface UpdateTicketDTO {
    estado?: EstadoTicket;
    codigo_unico?: string;
    fecha_uso?: string | null;
    id_tipo_entrada?: number;
}

/**
 * Resultado de validación de acceso a un ticket
 * - ACEPTADO: Ticket válido, fue marcado como UTILIZADO
 * - UTILIZADO: Ticket ya fue escaneado previamente (devuelve datos del ticket)
 * - NO_ENCONTRADO: No existe ticket con ese código
 * - ANULADO: Ticket está marcado como ANULADO
 */
export type ResultadoAccesoTicket =
    | { resultado: 'ACEPTADO'; ticket: TicketEnriquecido }
    | { resultado: 'UTILIZADO'; ticket?: TicketEnriquecido }
    | { resultado: 'NO_ENCONTRADO' | 'ANULADO' };
