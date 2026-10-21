import {Request, Response, NextFunction} from 'express';
import {AuditoriaService} from '../services/auditoria.service.js';

const auditoriaService = new AuditoriaService();

export class AuditoriaController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const registros = await auditoriaService.obtenerTodos();
            return res.status(200).json(registros);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const registro = await auditoriaService.obtenerPorId(Number(req.params.id));
            return res.status(200).json(registro);
        } catch (error) {
            next(error);
        }
    }
}