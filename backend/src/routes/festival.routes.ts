import {Router} from 'express';
import {FestivalController} from '../controllers/festival.controller.js';
import {authenticateJWT} from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/rbac.middleware.js";

const router = Router();
const controller = new FestivalController();

// Publicas
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Autenticadas y rol = PRODUCTOR
router.post('/', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.create);
router.put('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.update);
router.delete('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), controller.delete);

export default router;