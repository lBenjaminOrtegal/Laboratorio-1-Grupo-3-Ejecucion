import {Router} from "express";
import {UsuarioController} from "../controllers/usuario.controller.js";

const router = Router();
const controller = new UsuarioController();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);

export default router;
