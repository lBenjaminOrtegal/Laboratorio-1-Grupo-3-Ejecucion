export type EstadoFestival = 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';

export interface Festival {
    id: number;
    nombre: string;
    fecha_inicio: Date | string;
    fecha_fin: Date | string;
    estado: EstadoFestival;
    id_recinto: number;
    nombre_recinto: string;
    ciudad_recinto: string;
    direccion_recinto: string;
    id_productor: number;
    nombre_productor: string;
    apellido_productor: string;
}

export interface CreateFestivalDTO {
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado?: EstadoFestival;
    id_recinto: number;
    id_productor: number;
}

export interface UpdateFestivalDTO {
    nombre?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    estado?: EstadoFestival;
    id_recinto?: number;
    id_productor?: number;
}