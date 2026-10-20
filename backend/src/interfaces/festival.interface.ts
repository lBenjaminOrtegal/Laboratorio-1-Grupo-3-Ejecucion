export type EstadoFestival = 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';

export interface Festival{
    id: number;
    nombre: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado: EstadoFestival;
    id_recinto: number;
    id_productor: number;
}

export interface CreateFestivalDTO{
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado?: EstadoFestival;
    id_recinto: number;
    id_productor: number;
}

export interface UpdateFestivalDTO{
    nombre?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    estado?: EstadoFestival;
    id_recinto?: number;
    id_productor?: number;
}