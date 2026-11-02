import {Router} from 'express';
import {TicketController} from '../controllers/ticket.controller.js';
import {authenticateJWT} from '../middlewares/auth.middleware.js';
import {authorizeRoles} from '../middlewares/rbac.middleware.js';

const router = Router();
const controller = new TicketController();

// Rutas autenticadas para PRODUCTOR.
router.get('/', authenticateJWT, authorizeRoles('PRODUCTOR'), controller.getAll);
router.get('/:idOrdenCompra/:id', authenticateJWT, authorizeRoles('PRODUCTOR'), controller.getById);
router.post('/validar', authenticateJWT, authorizeRoles('PRODUCTOR'), controller.validarAcceso);
router.post('/', authenticateJWT, authorizeRoles('PRODUCTOR'), controller.create);
router.put('/:idOrdenCompra/:id', authenticateJWT, authorizeRoles('PRODUCTOR'), controller.update);
router.delete('/:idOrdenCompra/:id', authenticateJWT, authorizeRoles('PRODUCTOR'), controller.delete);

export default router;