import {Router} from "express";
import {OrdenCompraController} from "../controllers/orden_compra.controller.js";

const ordenCompraController = new OrdenCompraController();
const ordenCompraRouter = Router();

ordenCompraRouter.get('/', ordenCompraController.getAll);
ordenCompraRouter.get('/:id', ordenCompraController.getById);
ordenCompraRouter.post('/', ordenCompraController.create);
ordenCompraRouter.put('/:id', ordenCompraController.update);
ordenCompraRouter.delete('/:id', ordenCompraController.delete);

export default ordenCompraRouter;