
export interface CreateNotificacionDTO { mensaje: string; id_usuario: number; }

/**
 * Define los datos necesarios para actualizar una notificación existente.
 * Se utiliza Partial para hacer que todas las propiedades de CreateNotificacionDTO sean opcionales, lo que permite actualizar solo los campos necesarios en una notificación existente.
 */
export type UpdateNotificacionDTO = Partial<CreateNotificacionDTO>;

export interface Notificacion { id: number; mensaje: string; fecha_envio: Date; id_usuario: number; }
