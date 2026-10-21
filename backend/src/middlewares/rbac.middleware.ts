import {Response, NextFunction} from "express";
import {
    AuthenticatedRequest,
    RolUsuario,
} from "../interfaces/auth.interface.js";

export const authorizeRoles = (...allowedRoles: RolUsuario[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: "Usuario no autenticado.",
            });
        }

        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({
                error: `Acceso denegado. Se requiere rol: ${allowedRoles.join(" o ")}.`,
            });
        }

        next();
    };
};
