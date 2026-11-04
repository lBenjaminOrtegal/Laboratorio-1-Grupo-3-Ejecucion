export type EstadoPresentacion = 'PROGRAMADA' | 'CANCELADA' | 'FINALIZADA';

// Para el endpoint /grilla que usa nombres diferentes
export interface Presentacion {
    id_presentacion: number;
    fecha_inicio: Date | string;
    fecha_fin: Date | string;
    estado: EstadoPresentacion;
    id_artista: number;
    nombre_artista: string;
    genero_artista: string;
    id_escenario: number;
    nombre_escenario: string;
    id_festival: number;
    nombre_festival: string;
}

export interface PresentacionesEscenario {
    id_escenario: number;
    nombre_escenario: string;
    presentaciones: Presentacion[];
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