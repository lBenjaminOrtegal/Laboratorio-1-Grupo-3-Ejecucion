import {Request, Response, NextFunction} from 'express';
import {TicketService} from '../services/ticket.service.js';
import {AuthenticatedRequest} from '../interfaces/auth.interface.js';

const ticketService = new TicketService();

export class TicketController {

    /* 
        POST
        /api/tickets/validar
        registrar un único ingreso por código.
    */
    async validarAcceso(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ticketService.validarAcceso(req.body);
            return res.status(200).json({mensaje: 'Acceso permitido.', data});
        } catch (error: any) {
            // Si hay ticket en el error (ej. ticket ya utilizado), devolverlo con status apropiado
            if (error.ticket) {
                return res.status(error.status || 409).json({
                    mensaje: error.message,
                    data: error.ticket,
                });
            }
            next(error);
        }
    }

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

    /*
        GET
        /api/tickets/usuario/mis-tickets
        Devuelve todos los tickets del usuario autenticado
        - Solo visible para ASISTENTE
        - Filtra por id_usuario en el token JWT
    */
    async getTicketsByUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            // req.user es agregado por el middleware de autenticación
            const userId = req.user?.id;
            if (!userId) {
                const error: any = new Error('Usuario no autenticado.');
                error.status = 401;
                throw error;
            }
            const tickets = await ticketService.obtenerTicketsDelUsuario(userId);
            return res.status(200).json(tickets);
        } catch (error) {
            next(error);
        }
    }
}