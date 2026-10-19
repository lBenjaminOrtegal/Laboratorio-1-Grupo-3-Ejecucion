import { Router } from 'express';
import { RecintoController } from '../controllers/recinto.controller.js';

const recintoController = new RecintoController();
const recintoRouter = Router();

recintoRouter.get('/', recintoController.getAll);
recintoRouter.get('/:id', recintoController.getById);
recintoRouter.post('/', recintoController.create);
recintoRouter.put('/:id', recintoController.update);
recintoRouter.delete('/:id', recintoController.delete);

export default recintoRouter;