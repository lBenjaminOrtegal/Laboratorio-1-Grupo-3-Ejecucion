export type EstadoTicket = 'VALIDO' | 'UTILIZADO' | 'ANULADO';

export interface Ticket {
    id: number;
    id_orden_compra: number;
    estado: EstadoTicket;
    codigo_unico: string;
    fecha_uso: Date | null;
    id_tipo_entrada: number;
}

export interface CreateTicketDTO {
    id_orden_compra: number;
    estado?: EstadoTicket;
    codigo_unico: string;
    fecha_uso?: string | null;
    id_tipo_entrada: number;
}

export interface UpdateTicketDTO {
    estado?: EstadoTicket;
    codigo_unico?: string;
    fecha_uso?: string | null;
    id_tipo_entrada?: number;
}
// Es un type debido a que el resultado de validar un ticket
//  puede ser uno de varios estados, y no necesariamente un objeto Ticket. Esto permite manejar los diferentes resultados de la validación de manera más clara y específica.
export type ResultadoAccesoTicket =
    | {resultado: 'ACEPTADO'; ticket: Ticket} 
    | {resultado: 'NO_ENCONTRADO' | 'UTILIZADO' | 'ANULADO'}; // cuando el ticket no se encuentra, ya fue utilizado o está anulado, no se devuelve un objeto Ticket.
