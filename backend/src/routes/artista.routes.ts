import {Router} from 'express';
import {ArtistaController} from '../controllers/artista.controller.js';
import {authenticateJWT} from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/rbac.middleware.js";

const artistaController = new ArtistaController();
const artistaRouter = Router();

// Autenticadas y rol = PRODUCTOR
artistaRouter.get('/', authenticateJWT, authorizeRoles("PRODUCTOR"), artistaController.getAll);
artistaRouter.get('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), artistaController.getById);
artistaRouter.post('/', authenticateJWT, authorizeRoles("PRODUCTOR"), artistaController.create);
artistaRouter.put('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), artistaController.update);
artistaRouter.delete('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), artistaController.delete);

export default artistaRouter;