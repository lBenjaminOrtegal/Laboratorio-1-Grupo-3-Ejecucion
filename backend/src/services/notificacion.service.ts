import {NotificacionRepository} from '../repositories/notificacion.repository.js';
import {CreateNotificacionDTO, UpdateNotificacionDTO} from '../interfaces/notificacion.interface.js';
import {HttpError} from '../utils/http-error.js';
import {validarId, validarDatos, texto} from '../utils/validation.js';
import {UsuarioRepository} from '../repositories/usuario.repository.js';

/**
 * Servicio encargado de la lógica de negocio para la gestión de notificaciones.
 * Realiza las validaciones de datos y de integridad referencial antes de interactuar con el repositorio.
 */
export class NotificacionService {
    private repository = new NotificacionRepository();

    /**
     * Obtiene la lista completa de todas las notificaciones registradas.
     * @async
     * @returns {Promise<any[]>} Promesa que resuelve con un arreglo de todas las notificaciones.
     */
    async obtenerTodas() {
        return this.repository.findAll();
    }

    /**
     * Busca una notificación específica por su ID y valida su existencia.
     * @async
     * @param {number} id - El identificador único de la notificación.
     * @throws {HttpError} Lanza un error 400 si el ID es inválido o un error 404 si la notificación no existe.
     * @returns {Promise<any>} Promesa que resuelve con el objeto de la notificación encontrada.
     */
    async obtenerPorId(id: number) {
        validarId(id);
        const item = await this.repository.findById(id);
        if (!item) throw new HttpError(404, 'Notificacion no encontrado.');
        return item;
    }

    async obtenerPorUsuario(id: number) {
        return await this.repository.findByUser(id);
    }

    /**
     * Método privado para centralizar la validación y limpieza de los datos de la notificación.
     * Verifica la estructura del body, el tamaño del texto y la existencia del usuario destinatario.
     * @async
     * @private
     * @param {unknown} body - El cuerpo crudo de la petición que se desea validar.
     * @param {boolean} update - Flag que indica si la validación es para una actualización parcial (true) o creación (false).
     * @throws {HttpError} Lanza error 400 si los tipos de datos fallan o error 404 si el usuario relacionado no existe.
     * @returns {Promise<Record<string, any>>} Promesa que resuelve con los datos validados, limpios y tipados.
     */
    private async validar(body: unknown, update: boolean) {
        const data = {...validarDatos(body, update, ["mensaje", "id_usuario"], ["mensaje", "id_usuario"])};

        // Valida que el campo mensaje sea un texto y no supere el límite de longitud
        texto(data, 'mensaje', 10000);

        // Si se proporciona un id_usuario, verifica su tipo y comprueba que exista en el repositorio de usuarios
        if (data.id_usuario !== undefined) {
            if (typeof data.id_usuario !== 'number') throw new HttpError(400, 'id_usuario debe ser numérico.');
            validarId(data.id_usuario);

            const usuarioExiste = await new UsuarioRepository().findById(data.id_usuario);
            if (!usuarioExiste) throw new HttpError(404, 'Usuario destinatario no encontrado.');
        }

        return data;
    }

    /**
     * Crea una nueva notificación en el sistema tras validar sus campos obligatorios.
     * @async
     * @param {unknown} body - Datos de la nueva notificación.
     * @returns {Promise<any>} Promesa que resuelve con la notificación recién creada en la base de datos.
     */
    async crearNotificacion(body: unknown) {
        const data = await this.validar(body, false);
        return this.repository.create(data as unknown as CreateNotificacionDTO);
    }

    /**
     * Actualiza una notificación existente identificada por su ID, previa comprobación de existencia.
     * @async
     * @param {number} id - Identificador de la notificación a modificar.
     * @param {unknown} body - Datos parciales o completos a actualizar.
     * @throws {HttpError} Lanza error 404 si la notificación original o la modificada no se encuentran.
     * @returns {Promise<any>} Promesa que resuelve con el registro de la notificación actualizada.
     */
    async actualizarNotificacion(id: number, body: unknown) {
        await this.obtenerPorId(id); // Verifica si la notificación existe antes de procesar cambios
        const data = await this.validar(body, true);
        const item = await this.repository.update(id, data as UpdateNotificacionDTO);
        if (!item) throw new HttpError(404, 'Notificacion no encontrado.');
        return item;
    }

    /**
     * Elimina de forma lógica o física una notificación del sistema mediante su ID.
     * @async
     * @param {number} id - Identificador único de la notificación a borrar.
     * @throws {HttpError} Lanza error 400 si el ID es incorrecto o error 404 si el registro no existía.
     * @returns {Promise<any>} Promesa que resuelve con los datos de la notificación eliminada como confirmación.
     */
    async eliminarNotificacion(id: number) {
        validarId(id);
        const item = await this.repository.delete(id);
        if (!item) throw new HttpError(404, 'Notificacion no encontrado.');
        return item;
    }
}
