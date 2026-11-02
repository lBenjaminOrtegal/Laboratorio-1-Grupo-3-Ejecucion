import {Router} from "express";
import {EscenarioController} from "../controllers/escenario.controller.js";
import {authenticateJWT} from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/rbac.middleware.js";

const escenarioController = new EscenarioController();
const escenarioRouter = Router();

escenarioRouter.get('/', escenarioController.getAll);
escenarioRouter.get('/:id', escenarioController.getById);

// Autenticadas y rol = PRODUCTOR
escenarioRouter.post('/', authenticateJWT, authorizeRoles("PRODUCTOR"), escenarioController.create);
escenarioRouter.put('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), escenarioController.update);
escenarioRouter.delete('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), escenarioController.delete);

export default escenarioRouter;