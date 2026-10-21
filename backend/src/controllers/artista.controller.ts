import {Request, Response, NextFunction} from 'express';
import {ArtistaService} from '../services/artista.service.js';

const artistaService = new ArtistaService();

export class ArtistaController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const artistas = await artistaService.obtenerTodos();
            return res.status(200).json(artistas);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const artista = await artistaService.obtenerPorId(Number(req.params.id));
            return res.status(200).json(artista);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const nuevoArtista = await artistaService.crearArtista(req.body);
            return res.status(201).json({
                mensaje: 'Artista creado exitosamente.',
                data: nuevoArtista,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const artistaActualizado = await artistaService.actualizarArtista(
                Number(req.params.id),
                req.body
            );
            return res.status(200).json({
                mensaje: 'Artista actualizado correctamente.',
                data: artistaActualizado,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const resultado = await artistaService.eliminarArtista(Number(req.params.id));
            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }
}