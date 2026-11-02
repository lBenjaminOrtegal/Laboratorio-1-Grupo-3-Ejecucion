import {Router} from 'express';
import {AuditoriaController} from '../controllers/auditoria.controller.js';
import {authenticateJWT} from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/rbac.middleware.js";

const auditoriaController = new AuditoriaController();
const auditoriaRouter = Router();

// Autenticadas y rol = PRODUCTOR
auditoriaRouter.get('/', authenticateJWT, authorizeRoles("PRODUCTOR"), auditoriaController.getAll);
auditoriaRouter.get('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), auditoriaController.getById);

export default auditoriaRouter;