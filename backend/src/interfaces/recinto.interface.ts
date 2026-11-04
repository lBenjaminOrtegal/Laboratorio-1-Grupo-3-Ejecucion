export interface Recinto {
    id: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    capacidad: number;
}

export interface CreateRecintoDTO {
    nombre: string;
    direccion: string;
    ciudad: string;
    capacidad: number;
}

export interface UpdateRecintoDTO {
    nombre?: string;
    direccion?: string;
    ciudad?: string;
    capacidad?: number;
}