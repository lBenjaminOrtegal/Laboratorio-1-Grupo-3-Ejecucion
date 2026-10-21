import {Request, Response, NextFunction} from 'express';
import {FestivalService} from '../services/festival.service.js';

const festivalService = new FestivalService();

export class FestivalController {
    /*
        GET
        /api/festivales
        Devuelve todos los festivales
    */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await festivalService.obtenerTodos();
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /*
        GET
        /api/festivales/:id
        Devuelve un festival segun su id
    */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await festivalService.obtenerPorId(Number(req.params.id));
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /*
        POST
        /api/festivales
        Crea un festival
    */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const nuevo = await festivalService.crearFestival(req.body);
            return res.status(201).json({
                mensaje: 'Festival creado con éxito.',
                data: nuevo,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        PUT
        /api/festivales/:id
        Actualiza un festival segun su id
    */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const actualizado = await festivalService.actualizarFestival(
                Number(req.params.id),
                req.body
            );
            return res.status(200).json({
                mensaje: 'Festival actualizado con éxito.',
                data: actualizado,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        DELETE
        /api/festivales/:id
        Elimina un festival segun su id
    */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const eliminado = await festivalService.eliminarFestival(Number(req.params.id));
            return res.status(200).json({
                mensaje: 'Festival eliminado con éxito.',
                data: eliminado,
            });
        } catch (error) {
            next(error);
        }
    }
}