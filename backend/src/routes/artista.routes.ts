import { Router } from 'express';
import { ArtistaController } from '../controllers/artista.controller.js';

const artistaController = new ArtistaController();
const artistaRouter = Router();

artistaRouter.get('/', artistaController.getAll);
artistaRouter.get('/:id', artistaController.getById);
artistaRouter.post('/', artistaController.create);
artistaRouter.put('/:id', artistaController.update);
artistaRouter.delete('/:id', artistaController.delete);

export default artistaRouter;