import {Request, Response, NextFunction} from 'express';
import {RecintoService} from '../services/recinto.service.js';

const recintoService = new RecintoService();

export class RecintoController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const recintos = await recintoService.obtenerTodos();
            return res.status(200).json(recintos);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const recinto = await recintoService.obtenerPorId(Number(req.params.id));
            return res.status(200).json(recinto);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const nuevoRecinto = await recintoService.crearRecinto(req.body);
            return res.status(201).json({
                mensaje: 'Recinto creado exitosamente.',
                data: nuevoRecinto,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const recintoActualizado = await recintoService.actualizarRecinto(
                Number(req.params.id),
                req.body
            );
            return res.status(200).json({
                mensaje: 'Recinto actualizado correctamente.',
                data: recintoActualizado,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const resultado = await recintoService.eliminarRecinto(Number(req.params.id));
            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }
}