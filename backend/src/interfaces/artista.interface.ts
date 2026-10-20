export interface Artista {
    id: number;
    nombre: string;
    genero: string;
}

export interface CreateArtistaDTO {
    nombre: string;
    genero: string;
}

export interface UpdateArtistaDTO {
    nombre?: string;
    genero?: string;
}