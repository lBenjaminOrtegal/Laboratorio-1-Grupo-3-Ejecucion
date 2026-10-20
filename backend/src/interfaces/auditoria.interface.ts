export interface Auditoria {
    id: number;
    tabla_afectada: string;
    accion: string;
    precio_anterior: number;
    precio_nuevo: number;
    usuario: string;
    fecha: Date;
}