import {Request, Response, NextFunction} from "express";
import {AuthService} from "../services/auth.service.js";
import {AuthenticatedRequest} from "../interfaces/auth.interface.js";

const authService = new AuthService();

export class AuthController {
    /*
          POST
          /api/auth/register
          Registra un usuario
      */
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const {nombre, apellido, correo, contrasena} = req.body;

            if (!nombre || !apellido || !correo || !contrasena) {
                return res
                    .status(400)
                    .json({error: "Todos los campos son obligatorios."});
            }

            const usuario = await authService.registrar({
                nombre,
                apellido,
                correo,
                contrasena,
            });

            return res.status(201).json({
                mensaje: "Usuario registrado exitosamente.",
                usuario,
            });
        } catch (error) {
            next(error);
        }
    }

    /*
          POST
          /api/auth/login
          Login de un usuario
      */
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {correo, contrasena} = req.body;

            if (!correo || !contrasena) {
                return res
                    .status(400)
                    .json({error: "Debe ingresar correo y contraseña."});
            }

            const resultado = await authService.login({correo, contrasena});
            return res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    }

    /*
          GET
          /api/auth/profile
          Devuelve el perfil de un usuario
      */
    async perfil(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const usuario = await authService.obtenerPerfil(req.user!.id);
            return res.status(200).json(usuario);
        } catch (error) {
            next(error);
        }
    }
}
