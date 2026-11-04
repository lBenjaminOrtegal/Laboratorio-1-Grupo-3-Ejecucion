export interface Auditoria {
    id: number;
    fecha_modificacion: string;
    precio_anterior: number | string;
    precio_nuevo: number | string;
    id_tipo_entrada: number;
    nombre_tipo_entrada?: string;
    nombre_festival?: string;
    id_productor: number;
    nombre_productor?: string;
    apellido_productor?: string;
    correo_productor?: string;
}