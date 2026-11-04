export interface ReporteVentasOcupacion {
    id_festival: number;
    nombre_festival: string;
    id_tipo_entrada: number;
    nombre_tipo_entrada: string;
    stock_inicial: number;
    stock_disponible: number;
    tickets_vendidos: number;
    porcentaje_aforo_vendido: string | number;
    recaudacion_total: string | number;
}