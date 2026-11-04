/**
 * Tipo de Entrada para un Festival
 * Representa una categoría de ticket con precio en pesos chilenos (sin decimales)
 */
export interface TipoEntrada {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number | string; // NUMERIC(10, 0) del backend
  stock_inicial: number;
  stock_disponible: number;
  fecha_acceso: string; // Fecha ISO
  id_festival: number;
}

export interface CreateTipoEntradaDTO {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock_inicial: number;
  stock_disponible: number;
  fecha_acceso: string;
  id_festival: number;
}

export interface UpdateTipoEntradaDTO {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock_inicial?: number;
  stock_disponible?: number;
  fecha_acceso?: string;
}
