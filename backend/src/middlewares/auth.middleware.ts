import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import {AuthenticatedRequest, JwtPayloadUsuario,} from "../interfaces/auth.interface.js";

const JWT_SECRET =
    process.env.JWT_SECRET || "super_secret_jwt_key_festival_2026";

export const authenticateJWT = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "No autorizado. Debe proporcionar un token Bearer válido.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = jwt.verify(token, JWT_SECRET) as JwtPayloadUsuario;
        next();
    } catch (error) {
        return res.status(401).json({
            error: "Token inválido o expirado.",
        });
    }
};
