import {pool} from '../config/db.js';
import {Notificacion, CreateNotificacionDTO, UpdateNotificacionDTO} from '../interfaces/notificacion.interface.js';

export class NotificacionRepository {

    // Obtiene todas las notificaciones registradas en la base de datos ordenadas por su ID.
    async findAll(): Promise<Notificacion[]> {
        const {rows} = await pool.query('SELECT id, mensaje, fecha_envio, id_usuario FROM notificacion ORDER BY id');
        return rows;
    }

    // Busca una notificación específica por su identificador único.
    async findById(id: number): Promise<Notificacion | null> {
        const {rows} = await pool.query('SELECT id, mensaje, fecha_envio, id_usuario FROM notificacion WHERE id = $1', [id]);
        return rows[0] ?? null;
    }

    // Busca todas las notificaciones de un usuario
    async findByUser(id: number): Promise<Notificacion[] | null> {
        const {rows} = await pool.query('SELECT id, mensaje, fecha_envio FROM notificacion WHERE id_usuario = $1', [id]);
        return rows;
    }

    // Inserta una nueva notificación en la base de datos vinculándola a un usuario destinatario.
    async create(data: CreateNotificacionDTO): Promise<Notificacion> {
        const {rows} = await pool.query(
            'INSERT INTO notificacion (mensaje, id_usuario) VALUES ($1, $2) RETURNING id, mensaje, fecha_envio, id_usuario',
            [data.mensaje ?? null, data.id_usuario ?? null]
        );
        return rows[0];
    }

    // Actualiza parcialmente los campos de una notificación existente.
    async update(id: number, data: UpdateNotificacionDTO): Promise<Notificacion | null> {
        const {rows} = await pool.query(
            'UPDATE notificacion SET mensaje = COALESCE($1, mensaje), id_usuario = COALESCE($2, id_usuario) WHERE id = $3 RETURNING id, mensaje, fecha_envio, id_usuario',
            [data.mensaje ?? null, data.id_usuario ?? null, id]
        );
        return rows[0] ?? null;
    }

    // Elimina de forma física una notificación de la base de datos mediante su ID.
    async delete(id: number): Promise<Notificacion | null> {
        const {rows} = await pool.query('DELETE FROM notificacion WHERE id = $1 RETURNING id, mensaje, fecha_envio, id_usuario', [id]);
        return rows[0] ?? null;
    }
}
