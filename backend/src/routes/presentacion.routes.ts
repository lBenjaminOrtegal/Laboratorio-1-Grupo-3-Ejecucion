import {Router} from 'express';
import {PresentacionController} from '../controllers/presentacion.controller.js';
import {authorizeRoles} from "../middlewares/rbac.middleware.js";
import {authenticateJWT} from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new PresentacionController();

// Publicas
router.get('/', controller.getAll);
router.get('/grilla', controller.getLineUp);
router.get('/:id', controller.getById);

// Autenticadas y rol = PRODUCTOR
router.post('/', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.create);
router.put('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.update);
router.delete('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.delete);
router.post('/:id/cancelar', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.cancelar);

export default router;