import { Router } from 'express';
import { PresentacionController } from '../controllers/presentacion.controller.js';

const router = Router();
const controller = new PresentacionController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;