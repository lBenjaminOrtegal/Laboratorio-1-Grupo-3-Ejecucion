import {Request, Response, NextFunction} from 'express';
import { EscenarioService } from '../services/escenario.service.js';

const escenarioService = new EscenarioService();

export class EscenarioController {
    /*
        GET
        /api/escenarios
        Devuelve todos los escenarios
    */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const escenarios = await escenarioService.obtenerTodos();
            return res.status(200).json(escenarios);
        } catch (error) {
            next(error);
        }
    }

    /*
        GET
        /api/escenarios/:id
        Devuelve un escenario segun su id
    */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const escenario = await escenarioService.obtenerPorId(Number(req.params.id));
            return res.status(200).json(escenario);
        } catch (error) {
            next(error);
        }
    }

    /*
        POST
        /api/escenarios
        Crea un escenario
    */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const nuevoEscenario = await escenarioService.crearEscenario(req.body);
            return res.status(201).json({
                mensaje: 'Escenario creado exitosamente.',
                data: nuevoEscenario,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        PUT
        /api/escenarios/:id
        Actualiza un escenario segun su id
    */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const escenarioActualizado = await escenarioService.actualizarEscenario(
                Number(req.params.id),
                req.body
            );
            return res.status(200).json({
                mensaje: 'Escenario actualizado correctamente.',
                data: escenarioActualizado,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        DELETE
        /api/escenarios/:id
        Elimina un escenario segun su id
    */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const resultado = await escenarioService.eliminarEscenario(Number(req.params.id));
            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }
}