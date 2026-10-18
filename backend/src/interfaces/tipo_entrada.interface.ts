export interface TipoEntrada {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock_inicial: number;
    stock_disponible: number;
    fecha_acceso: Date | string;
    id_festival: number;
}

export interface CreateTipoEntradaDTO {
    nombre: string;
    descripcion: string;
    precio: number;
    stock_inicial: number;
    stock_disponible: number;
    fecha_acceso: string;
    id_festival: number;
}

export interface UpdateTipoEntradaDTO {
    nombre: string;
    descripcion: string;
    precio: number;
    stock_inicial: number;
    stock_disponible: number;
    fecha_acceso: string;
    id_festival: number;
}