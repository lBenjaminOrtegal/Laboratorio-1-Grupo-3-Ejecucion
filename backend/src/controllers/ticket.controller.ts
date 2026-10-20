import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticket.service.js';

const ticketService = new TicketService();

export class TicketController {
    /*
        GET
        /api/tickets
        Devuelve todos los tickets
    */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ticketService.obtenerTodos();
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /*
        GET
        /api/tickets/:idOrdenCompra/:id
        Devuelve un ticket segun su clave compuesta (idOrdenCompra y id)
    */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ticketService.obtenerPorId(Number(req.params.idOrdenCompra), Number(req.params.id));
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    /*
        POST
        /api/tickets
        Crea un ticket
    */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const nuevo = await ticketService.crearTicket(req.body);
            return res.status(201).json({
                mensaje: 'Ticket creado con éxito.',
                data: nuevo,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        PUT
        /api/tickets/:idOrdenCompra/:id
        Actualiza un ticket segun su clave compuesta (idOrdenCompra y id)
    */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const actualizado = await ticketService.actualizarTicket(
                Number(req.params.idOrdenCompra),
                Number(req.params.id),
                req.body
            );
            return res.status(200).json({
                mensaje: 'Ticket actualizado con éxito.',
                data: actualizado,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        DELETE
        /api/tickets/:idOrdenCompra/:id
        Elimina un ticket segun su clave compuesta (idOrdenCompra y id)
    */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const eliminado = await ticketService.eliminarTicket(Number(req.params.idOrdenCompra), Number(req.params.id));
            return res.status(200).json({
                mensaje: 'Ticket eliminado con éxito.',
                data: eliminado,
            });
        } catch (error) {
            next(error);
        }
    }
}