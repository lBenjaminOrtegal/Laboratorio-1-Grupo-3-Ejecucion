import { Request, Response, NextFunction } from 'express';
import { PresentacionService } from '../services/presentacion.service.js';
import { AuthenticatedRequest } from '../interfaces/auth.interface.js';

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
        GET
        /api/presentaciones/grilla
        Devuelve la grilla de presentaciones de un festival, en un dia especifico y agrupadas por escenario
    */
    async getLineUp(req: Request, res: Response, next: NextFunction) {
        try {
            const id_festival = Number(req.query.id_festival);
            const fecha = req.query.fecha as string;

            if (!req.query.id_festival || isNaN(id_festival) || id_festival <= 0) {
                return res.status(400).json({
                    error: 'Debe proporcionar un parámetro id_festival numérico válido.',
                });
            }

            if (!fecha) {
                return res.status(400).json({
                    error: 'Debe proporcionar el parámetro fecha (ej. ?fecha=2026-11-14).',
                });
            }

            const resultado = await presentacionService.obtenerGrilla(id_festival, fecha);
            return res.status(200).json(resultado);
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


    /*
        POST
        /api/presentaciones/:id/cancelar
        Cancela una presentacion segun su id y el id del productor que realiza la accion.
    */
    async cancelar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Usuario no autenticado.',
                });
            }

        const id_presentacion = Number(req.params.id);
        const id_productor = req.user.id;

        await presentacionService.cancelarPresentacion(id_presentacion, id_productor);

        return res.status(200).json({
            mensaje: 'Presentación cancelada correctamente.',
        });
        } catch (error) {
            next(error);
        }
    }
}