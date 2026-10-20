import {Router} from "express";
import {EscenarioController} from "../controllers/escenario.controller.js";

const escenarioController = new EscenarioController();
const escenarioRouter = Router();

escenarioRouter.get('/', escenarioController.getAll);
escenarioRouter.get('/:id', escenarioController.getById);
escenarioRouter.post('/', escenarioController.create);
escenarioRouter.put('/:id', escenarioController.update);
escenarioRouter.delete('/:id', escenarioController.delete);

export default escenarioRouter;