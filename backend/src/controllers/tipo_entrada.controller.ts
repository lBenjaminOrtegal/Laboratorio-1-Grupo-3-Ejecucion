import { Request, Response, NextFunction } from 'express';
import { TipoEntradaService } from '../services/tipo_entrada.service.js';

const tipoEntradaService = new TipoEntradaService();

export class TipoEntradaController {
    /*
        GET
        /api/tipos-entrada
        Devuelve todos los tipos de entradas
    */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await tipoEntradaService.obtenerTodas();
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /*
        GET
        /api/tipos-entrada/:id
        Devuelve un tipo de entrada segun su id
    */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await tipoEntradaService.obtenerPorId(Number(req.params.id));
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /*
        POST
        /api/tipos-entrada
        Crea una presentacion
    */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const nuevo = await tipoEntradaService.crearTipoEntrada(req.body);
            return res.status(201).json({
                mensaje: 'Tipo de entrada creado exitosamente.',
                data: nuevo,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        PUT
        /api/tipos-entrada/:id
        Actualiza un tipo de entrada segun su id
    */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const actualizado = await tipoEntradaService.actualizarTipoEntrada(
                Number(req.params.id),
                req.body
            );
            return res.status(200).json({
                mensaje: 'Tipo de entrada actualizado correctamente.',
                data: actualizado,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        DELETE
        /api/tipos-entrada/:id
        Elimina un tipo de entrada segun su id
    */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const eliminado = await tipoEntradaService.eliminarTipoEntrada(Number(req.params.id));
            return res.status(200).json({
                mensaje: 'Tipo de entrada eliminado correctamente.',
                data: eliminado,
            });
        } catch (error) {
            next(error);
        }
    }
}