import {Request} from "express";

export type RolUsuario = "PRODUCTOR" | "ASISTENTE";

export interface JwtPayloadUsuario {
    id: number;
    correo: string;
    rol: RolUsuario;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayloadUsuario;
}

export interface RegisterDTO {
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
}

export interface LoginDTO {
    correo: string;
    contrasena: string;
}
