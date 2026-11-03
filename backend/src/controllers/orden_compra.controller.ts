import {Request, Response, NextFunction} from "express";
import {OrdenCompraService} from "../services/orden_compra.service.js";
import {AuthenticatedRequest} from "../interfaces/auth.interface.js";

const ordenCompraService = new OrdenCompraService();

export class OrdenCompraController {
    /*
    GET
    /api/ordenes-compra
    Devuelve todas las ordenes de compra
*/
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const ordenesCompra = await ordenCompraService.obtenerTodas();
            return res.status(200).json(ordenesCompra);
        } catch (error) {
            next(error);
        }
    }

    /*
        GET
        /api/ordenes-compra/:id
        Devuelve una orden de compra segun su id
    */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const ordenCompra = await ordenCompraService.obtenerPorId(Number(req.params.id));
            return res.status(200).json(ordenCompra);
        } catch (error) {
            next(error);
        }
    }

    /*
        POST
        /api/ordenes-compra
        Crea una orden de compra
    */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const nuevaOrdenCompra = await ordenCompraService.crearOrdenCompra(req.body);
            return res.status(201).json({
                mensaje: 'Orden de compra creada exitosamente.',
                data: nuevaOrdenCompra,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        PUT
        /api/ordenes-compra/:id
        Actualiza una orden de compra segun su id
    */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const ordenCompraActualizada = await ordenCompraService.actualizarOrdenCompra(
                Number(req.params.id),
                req.body
            );
            return res.status(200).json({
                mensaje: 'Orden de compra actualizada exitosamente.',
                data: ordenCompraActualizada,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
        DELETE
        /api/ordenes-compra/:id
        Elimina una orden de compra segun su id
    */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const ordenCompraEliminada = await ordenCompraService.eliminarOrdenCompra(Number(req.params.id));
            return res.status(200).json(ordenCompraEliminada);
        } catch (error) {
            next(error);
        }
    }

    /*
        GET
        /api/ordenes-compra/usuario/mis-ordenes
        Devuelve todas las órdenes de compra del usuario autenticado (asistente)
    */
    async getOrdenesDelAsistente(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                const error: any = new Error('Usuario no autenticado.');
                error.status = 401;
                throw error;
            }
            const ordenes = await ordenCompraService.obtenerOrdenesDelAsistente(userId);
            return res.status(200).json(ordenes);
        } catch (error) {
            next(error);
        }
    }
}