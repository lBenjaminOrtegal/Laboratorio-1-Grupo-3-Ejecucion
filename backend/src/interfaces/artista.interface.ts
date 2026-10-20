export interface Artista {
    id: number;
    nombre: string;
    genero: string;
    pais: string;
}

export interface CreateArtistaDTO {
    nombre: string;
    genero: string;
    pais: string;
}

export interface UpdateArtistaDTO {
    nombre?: string;
    genero?: string;
    pais?: string;
}