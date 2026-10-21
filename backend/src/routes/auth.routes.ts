import {Router} from "express";
import {AuthController} from "../controllers/auth.controller.js";
import {authenticateJWT} from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new AuthController();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", authenticateJWT, controller.perfil);

export default router;
