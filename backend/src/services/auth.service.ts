import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {UsuarioRepository} from "../repositories/usuario.repository.js";
import {JwtPayloadUsuario, LoginDTO, RegisterDTO,} from "../interfaces/auth.interface.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1h";

export class AuthService {
    private usuarioRepository: UsuarioRepository;

    constructor() {
        this.usuarioRepository = new UsuarioRepository();
    }

    async registrar(data: RegisterDTO) {
        const existente = await this.usuarioRepository.findByEmail(data.correo);

        if (existente) {
            const error: any = new Error("El correo electrónico ya está registrado.");
            error.status = 409;
            throw error;
        }

        const passwordHash = await bcrypt.hash(data.contrasena, 10);

        return await this.usuarioRepository.create({
            ...data,
            contrasena: passwordHash,
            rol: "ASISTENTE",
            activo: true,
        });
    }

    async login(data: LoginDTO) {
        const usuario = await this.usuarioRepository.findByEmail(data.correo);
        console.log(usuario);

        if (!usuario) {
            const error: any = new Error("Credenciales inválidas.");
            error.status = 401;
            throw error;
        }

        const passwordValida = await bcrypt.compare(
            data.contrasena,
            usuario.contrasena,
        );

        if (!passwordValida) {
            console.log("!passwordValida");
            const error: any = new Error("Credenciales inválidas.");
            error.status = 401;
            throw error;
        }

        const payload: JwtPayloadUsuario = {
            id: usuario.id,
            correo: usuario.correo,
            rol: usuario.rol,
        };

        const token = jwt.sign(payload, JWT_SECRET!, {expiresIn: JWT_EXPIRES_IN});

        return {
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                rol: usuario.rol,
                credito_acumulado: usuario.credito_acumulado,
                activo: usuario.activo,
            },
        };
    }

    async obtenerPerfil(idUsuario: number) {
        const usuario = await this.usuarioRepository.findById(idUsuario);

        if (!usuario) {
            const error: any = new Error("Usuario no encontrado.");
            error.status = 404;
            throw error;
        }

        return usuario;
    }
}
