import {Router} from 'express';
import {RecintoController} from '../controllers/recinto.controller.js';
import {authenticateJWT} from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/rbac.middleware.js";

const recintoController = new RecintoController();
const recintoRouter = Router();

// Publicas
recintoRouter.get('/', recintoController.getAll);
recintoRouter.get('/:id', recintoController.getById);

// Autenticadas y rol = PRODUCTOR
recintoRouter.post('/', authenticateJWT, authorizeRoles("PRODUCTOR"), recintoController.create);
recintoRouter.put('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), recintoController.update);
recintoRouter.delete('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), recintoController.delete);

export default recintoRouter;