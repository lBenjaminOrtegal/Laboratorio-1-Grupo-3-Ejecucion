import {Router} from "express";
import {UsuarioController} from "../controllers/usuario.controller.js";
import {authenticateJWT} from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/rbac.middleware.js";

const router = Router();
const controller = new UsuarioController();

// Autenticadas y rol = PRODUCTOR
router.get("/", authenticateJWT, authorizeRoles("PRODUCTOR"), controller.getAll);
router.get("/:id", authenticateJWT, authorizeRoles("PRODUCTOR"), controller.getById);
router.post("/", authenticateJWT, authorizeRoles("PRODUCTOR"), controller.create);
router.put("/:id", authenticateJWT, authorizeRoles("PRODUCTOR"), controller.update);

export default router;
