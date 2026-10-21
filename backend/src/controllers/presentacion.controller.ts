import {Request, Response, NextFunction} from 'express';
import {PresentacionService} from '../services/presentacion.service.js';

const presentacionService = new PresentacionService();

export class PresentacionController {
    /*
        GET
        /api/presentaciones
        Devuelve todas las presentaciones
    */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await presentacionService.obtenerTodas();
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /*
        GET
        /api/presentaciones/:id
        Devuelve una presentacion segun su id
    */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await presentacionService.obtenerPorId(Number(req.params.id));
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /*
        POST
        /api/presentaciones
        Crea una presentacion
    */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const nueva = await presentacionService.crearPresentacion(req.body);
            return res.status(201).json({
                mensaje: 'Presentación programada exitosamente.',
                data: nueva,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        PUT
        /api/presentaciones/:id
        Actualiza una presentacion segun su id
    */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const actualizada = await presentacionService.actualizarPresentacion(
                Number(req.params.id),
                req.body
            );
            return res.status(200).json({
                mensaje: 'Presentación actualizada correctamente.',
                data: actualizada,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        DELETE
        /api/presentaciones/:id
        Elimina una presentacion segun su id
    */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const eliminada = await presentacionService.eliminarPresentacion(Number(req.params.id));
            return res.status(200).json({
                mensaje: 'Presentación eliminada correctamente.',
                data: eliminada,
            });
        } catch (error) {
            next(error);
        }
    }
}