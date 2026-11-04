export interface Escenario {
    id: number;
    nombre: string;
    capacidad: number;
    id_festival: number;
}

export interface CreateEscenarioDTO {
    nombre: string;
    capacidad: number;
    id_festival: number;
}

export interface UpdateEscenarioDTO {
    nombre?: string;
    capacidad?: number;
    id_festival?: number;
}