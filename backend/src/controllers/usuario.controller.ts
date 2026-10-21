import {Request, Response, NextFunction} from "express";
import {UsuarioService} from "../services/usuario.service.js";

const service = new UsuarioService();

// Rutas: /api/usuarios y /api/usuarios/:id
export class UsuarioController {
    /**
     * (GET) /api/usuarios
     * Obtiene todos los usuarios.
     * @param {Request} req - Objeto de petición de Express.
     * @param {Response} res - Objeto de respuesta de Express.
     * @param {NextFunction} next - Función de middleware para manejar errores.
     * @returns {Promise<Response>} Promesa que resuelve con la lista de usuarios y estado 200.
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.obtenerTodas();
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /**
     * (GET) /api/usuarios/:id
     * Obtiene un usuario por su ID.
     * @param {Request} req - Objeto de petición que contiene el ID en `req.params.id`.
     * @param {Response} res - Objeto de respuesta de Express.
     * @param {NextFunction} next - Función de middleware para manejar errores.
     * @returns {Promise<Response>} Promesa que resuelve con los datos del usuario o pasa el error.
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
     * (POST) /api/usuarios
     * Crea un nuevo usuario.
     * @param {Request} req - Objeto de petición que contiene los datos del usuario en `req.body`.
     * @param {Response} res - Objeto de respuesta de Express.
     * @param {NextFunction} next - Función de middleware para manejar errores.
     * @returns {Promise<Response>} Promesa que resuelve con el mensaje de éxito y el usuario creado.
     */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.crearUsuario(req.body);
            return res
                .status(201)
                .json({mensaje: "Registro creado correctamente.", data});
        } catch (error) {
            next(error);
        }
    }

    /**
     * (PUT) /api/usuarios/:id
     * Actualiza un usuario por su ID.
     * @param {Request} req - Objeto de petición con el ID en `req.params.id` y los campos a actualizar en `req.body`.
     * @param {Response} res - Objeto de respuesta de Express.
     * @param {NextFunction} next - Función de middleware para manejar errores.
     * @returns {Promise<Response>} Promesa que devuelve la confirmación de la actualización.
     */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await service.actualizarUsuario(
                Number(req.params.id),
                req.body,
            );
            return res
                .status(200)
                .json({mensaje: "Registro actualizado correctamente.", data});
        } catch (error) {
            next(error);
        }
    }
}
