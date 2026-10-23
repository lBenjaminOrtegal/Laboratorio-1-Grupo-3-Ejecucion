import {Router} from "express";
import {OrdenCompraController} from "../controllers/orden_compra.controller.js";
import {authenticateJWT} from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/rbac.middleware.js";

const ordenCompraController = new OrdenCompraController();
const ordenCompraRouter = Router();

// Autenticadas
// ordenCompraRouter.get('/propias', authenticateJWT, ordenCompraController.getByUser);

// Autenticadas y rol = PRODUCTOR
ordenCompraRouter.get('/', authenticateJWT, authorizeRoles("PRODUCTOR"), ordenCompraController.getAll);
ordenCompraRouter.get('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), ordenCompraController.getById);
// Revisar resto, capaz no son necesarias
ordenCompraRouter.post('/', authenticateJWT, authorizeRoles("PRODUCTOR"), ordenCompraController.create);
ordenCompraRouter.put('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), ordenCompraController.update);
ordenCompraRouter.delete('/:id', authenticateJWT, authorizeRoles("PRODUCTOR"), ordenCompraController.delete);

export default ordenCompraRouter;