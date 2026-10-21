import {Request, Response, NextFunction} from "express";
import {OrdenCompraService} from "../services/orden_compra.service.js";

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
}