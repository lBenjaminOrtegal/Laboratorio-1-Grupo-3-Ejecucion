import { Router } from 'express';
import { TipoEntradaController } from '../controllers/tipo_entrada.controller.js';

const router = Router();
const controller = new TipoEntradaController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;