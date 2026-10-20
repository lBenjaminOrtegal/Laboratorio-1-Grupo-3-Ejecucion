import { pool } from '../config/db.js';
import { Notificacion, CreateNotificacionDTO, UpdateNotificacionDTO } from '../interfaces/notificacion.interface.js';

/**
 * Repositorio encargado de gestionar el acceso y manipulación de los datos de la tabla 'notificacion'.
 */
export class NotificacionRepository {
  
  /**
   * Obtiene todas las notificaciones registradas en la base de datos ordenadas por su ID.
   * @async
   * @returns {Promise<Notificacion[]>} Promesa que resuelve con un arreglo de todas las notificaciones encontradas.
   */
  async findAll(): Promise<Notificacion[]> {
    const { rows } = await pool.query('SELECT id, mensaje, fecha_envio, id_usuario FROM notificacion ORDER BY id');
    return rows;
  }

  /**
   * Busca una notificación específica por su identificador único.
   * @async
   * @param {number} id - El identificador único de la notificación a buscar.
   * @returns {Promise<Notificacion | null>} Promesa que resuelve con el objeto Notificacion si existe, o null si no es encontrada.
   */
  async findById(id: number): Promise<Notificacion | null> {
    const { rows } = await pool.query('SELECT id, mensaje, fecha_envio, id_usuario FROM notificacion WHERE id = $1', [id]);
    return rows[0] ?? null;
  }

  /**
   * Inserta una nueva notificación en la base de datos vinculándola a un usuario destinatario.
   * @async
   * @param {CreateNotificacionDTO} data - Objeto con las propiedades requeridas para la creación del registro.
   * @returns {Promise<Notificacion>} Promesa que resuelve con la notificación recién creada e incluye su ID y fecha_envio generados por la BD.
   */
  async create(data: CreateNotificacionDTO): Promise<Notificacion> {
    const { rows } = await pool.query(
      'INSERT INTO notificacion (mensaje, id_usuario) VALUES ($1, $2) RETURNING id, mensaje, fecha_envio, id_usuario', 
      [data.mensaje ?? null, data.id_usuario ?? null]
    );
    return rows[0];
  }

  /**
   * Actualiza parcialmente los campos de una notificación existente.
   * Utiliza la función COALESCE de SQL para conservar los valores originales si las propiedades de 'data' son nulas o indefinidas.
   * @async
   * @param {number} id - El identificador único de la notificación a modificar.
   * @param {UpdateNotificacionDTO} data - Objeto con los datos opcionales que se desean actualizar.
   * @returns {Promise<Notificacion | null>} Promesa que resuelve con el registro modificado, o null si el ID no existía.
   */
  async update(id: number, data: UpdateNotificacionDTO): Promise<Notificacion | null> {
    const { rows } = await pool.query(
      'UPDATE notificacion SET mensaje = COALESCE($1, mensaje), id_usuario = COALESCE($2, id_usuario) WHERE id = $3 RETURNING id, mensaje, fecha_envio, id_usuario', 
      [data.mensaje ?? null, data.id_usuario ?? null, id]
    );
    return rows[0] ?? null;
  }

  /**
   * Elimina de forma física una notificación de la base de datos mediante su ID.
   * @async
   * @param {number} id - El identificador único de la notificación que se va a remover.
   * @returns {Promise<Notificacion | null>} Promesa que resuelve con los datos de la notificación eliminada como confirmación, o null si no existía.
   */
  async delete(id: number): Promise<Notificacion | null> {
    const { rows } = await pool.query('DELETE FROM notificacion WHERE id = $1 RETURNING id, mensaje, fecha_envio, id_usuario', [id]);
    return rows[0] ?? null;
  }
}
