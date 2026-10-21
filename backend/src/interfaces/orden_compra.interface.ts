export type MetodoPago = 'TARJETA_CREDITO' | 'TARJETA_DEBITO';
export type EstadoOrdenCompra = 'PENDIENTE' | 'PAGADO' | 'CANCELADO' | 'FALLIDO' | 'REEMBOLSADO';

export interface OrdenCompra {
    id: number;
    fecha_compra: Date;
    monto: number;
    metodo_pago: MetodoPago;
    estado: EstadoOrdenCompra;
    id_asistente: number;
}

export interface CreateOrdenCompraDTO {
    monto: number;
    metodo_pago: MetodoPago;
    estado?: EstadoOrdenCompra;
    id_asistente: number;
}

export interface UpdateOrdenCompraDTO {
    monto?: number;
    metodo_pago?: MetodoPago;
    estado?: EstadoOrdenCompra;
    id_asistente?: number;
}

