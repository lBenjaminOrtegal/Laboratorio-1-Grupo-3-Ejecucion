import {Router} from 'express';
import {TicketController} from '../controllers/ticket.controller.js';

const router = Router();
const controller = new TicketController();

router.get('/', controller.getAll);
router.get('/:idOrdenCompra/:id', controller.getById);
router.post('/', controller.create);
router.put('/:idOrdenCompra/:id', controller.update);
router.delete('/:idOrdenCompra/:id', controller.delete);

export default router;