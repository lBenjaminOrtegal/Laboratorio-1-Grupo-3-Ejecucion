import { Router } from 'express';
import { NotificacionController } from '../controllers/notificacion.controller.js';

const router = Router();
const controller = new NotificacionController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;