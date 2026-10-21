import {Router} from 'express';
import {AuditoriaController} from '../controllers/auditoria.controller.js';

const auditoriaController = new AuditoriaController();
const auditoriaRouter = Router();

auditoriaRouter.get('/', auditoriaController.getAll);
auditoriaRouter.get('/:id', auditoriaController.getById);

export default auditoriaRouter;