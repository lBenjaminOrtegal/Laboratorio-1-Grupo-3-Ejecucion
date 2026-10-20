export type EstadoTicket = 'VALIDO' | 'UTILIZADO' | 'ANULADO';

export interface Ticket{
    id: number;
    id_orden_compra: number;
    estado: EstadoTicket;
    codigo_unico: string;
    fecha_uso: Date | null;
    id_tipo_entrada: number;
}

export interface CreateTicketDTO{
    id_orden_compra: number;
    estado?: EstadoTicket;
    codigo_unico: string;
    fecha_uso?: string | null;
    id_tipo_entrada: number;
}

export interface UpdateTicketDTO{
    estado?: EstadoTicket;
    codigo_unico?: string;
    fecha_uso?: string | null;
    id_tipo_entrada?: number;
}