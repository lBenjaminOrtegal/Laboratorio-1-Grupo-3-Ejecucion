export type EstadoPresentacion = 'PROGRAMADA' | 'CANCELADA' | 'FINALIZADA';

export interface Presentacion {
    id: number;
    fecha_inicio: Date | string;
    fecha_fin: Date | string;
    estado: EstadoPresentacion;
    id_artista: number;
    id_escenario: number;
}

export interface CreatePresentacionDTO {
    fecha_inicio: string;
    fecha_fin: string;
    estado?: EstadoPresentacion;
    id_artista: number;
    id_escenario: number;
}

export interface UpdatePresentacionDTO {
    fecha_inicio?: string;
    fecha_fin?: string;
    estado?: EstadoPresentacion;
    id_artista?: number;
    id_escenario?: number;
}