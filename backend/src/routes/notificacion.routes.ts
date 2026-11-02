import {Router} from 'express';
import {NotificacionController} from '../controllers/notificacion.controller.js';
import {authenticateJWT} from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/rbac.middleware.js";

const router = Router();
const controller = new NotificacionController();

// Autenticadas
router.get('/propias', authenticateJWT, controller.getByUser);

// Autenticadas y rol = PRODUCTOR
router.get('/', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.getAll);
router.get('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.getById);
router.post('/', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.create);
router.put('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.update);
router.delete('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.delete);

export default router;