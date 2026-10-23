import {Request, Response, NextFunction} from 'express';
import {NotificacionService} from '../services/notificacion.service.js';
import {AuthenticatedRequest} from "../interfaces/auth.interface.js";

const service = new NotificacionService();

// Rutas: /api/notificaciones y /api/notificaciones/:id
export class NotificacionController {

    /**
     * (GET) /api/notificaciones
     * Obtiene todas las notificaciones del sistema.
     * @param {Request} req - Objeto de petición de Express.
     * @param {Response} res - Objeto de respuesta de Express.
     * @param {NextFunction} next - Función de middleware para manejo de errores.
     * @returns {Promise<Response | void>} Promesa que resuelve con la lista de notificaciones y estado 200.
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.obtenerTodas();
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /*
        GET
        Devuelve las notificaciones propias del usuario
        /api/notificaciones/propias
    */
    async getByUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const notificaciones = await service.obtenerPorUsuario(req.user!.id);
            return res.status(200).json(notificaciones);
        } catch (error) {
            next(error);
        }
    }

    /**
     * (GET) /api/notificaciones/:id
     * Obtiene una notificación específica por su ID.
     * @param {Request} req - Objeto de petición con el parámetro de ruta en `req.params.id`.
     * @param {Response} res - Objeto de respuesta de Express.
     * @param {NextFunction} next - Función de middleware para manejo de errores.
     * @returns {Promise<Response | void>} Promesa que resuelve con la notificación encontrada y estado 200.
     */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.obtenerPorId(Number(req.params.id));
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /**
     * (POST) /api/notificaciones
     * Crea una nueva notificación.
     * @param {Request} req - Objeto de petición que contiene el cuerpo de la notificación en `req.body`.
     * @param {Response} res - Objeto de respuesta de Express.
     * @param {NextFunction} next - Función de middleware para manejo de errores.
     * @returns {Promise<Response | void>} Promesa que devuelve un mensaje de éxito y la notificación creada con estado 201.
     */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.crearNotificacion(req.body);
            return res.status(201).json({mensaje: 'Registro creado correctamente.', data});
        } catch (error) {
            next(error);
        }
    }

    /**
     * (PUT) /api/notificaciones/:id
     * Actualiza los datos de una notificación por su ID.
     * @param {Request} req - Petición con el ID en `req.params.id` y los campos modificados en `req.body`.
     * @param {Response} res - Objeto de respuesta de Express.
     * @param {NextFunction} next - Función de middleware para manejo de errores.
     * @returns {Promise<Response | void>} Promesa que confirma la actualización correcta con estado 200.
     */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.actualizarNotificacion(Number(req.params.id), req.body);
            return res.status(200).json({mensaje: 'Registro actualizado correctamente.', data});
        } catch (error) {
            next(error);
        }
    }

    /**
     * (DELETE) /api/notificaciones/:id
     * Elimina permanentemente una notificación por su ID.
     * @param {Request} req - Objeto de petición con el identificador en `req.params.id`.
     * @param {Response} res - Objeto de respuesta de Express.
     * @param {NextFunction} next - Función de middleware para manejo de errores.
     * @returns {Promise<Response | void>} Promesa que devuelve la confirmación de la eliminación y estado 200.
     */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.eliminarNotificacion(Number(req.params.id));
            return res.status(200).json({mensaje: 'Registro eliminado correctamente.', data});
        } catch (error) {
            next(error);
        }
    }
}
