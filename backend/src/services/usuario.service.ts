import {UsuarioRepository} from "../repositories/usuario.repository.js";
import {
    CreateUsuarioDTO,
    UpdateUsuarioDTO,
} from "../interfaces/usuario.interface.js";
import {HttpError} from "../utils/http-error.js";
import {validarId, validarDatos, texto} from "../utils/validation.js";
import {hash} from "bcryptjs";

/**
 * Servicio encargado de la lógica de negocio para la gestión de usuarios.
 * Aplica filtros de seguridad estrictos para tipos, estructuras, formatos de correo,
 * validación de roles de sistema, control de precisión numérica y encriptación de claves.
 */
export class UsuarioService {
    private repository = new UsuarioRepository();

    /**
     * Obtiene la lista completa de todos los usuarios registrados en el sistema.
     * @async
     * @returns {Promise<any[]>} Promesa que resuelve con un arreglo de todos los usuarios encontrados.
     */
    async obtenerTodas() {
        return this.repository.findAll();
    }

    /**
     * Busca un usuario por su identificador único y valida su existencia.
     * @async
     * @param {number} id - El identificador único del usuario.
     * @throws {HttpError} Lanza un error 400 si el ID es inválido o un error 404 si el usuario no existe.
     * @returns {Promise<any>} Promesa que resuelve con el objeto del usuario encontrado.
     */
    async obtenerPorId(id: number) {
        validarId(id);
        const item = await this.repository.findById(id);
        if (!item) throw new HttpError(404, "Usuario no encontrado.");
        return item;
    }

    /**
     * Método privado para centralizar la validación, limpieza y encriptación de datos del usuario.
     * Aplica reglas de negocio sobre el formato de correo, roles permitidos, límites de crédito
     * y longitud en bytes de la contraseña antes de procesar el hash.
     * @async
     * @private
     * @param {unknown} body - Cuerpo crudo de la petición que se desea validar.
     * @param {boolean} update - Flag que indica si la validación es para una modificación parcial (true) o creación (false).
     * @throws {HttpError} Lanza error 400 si alguna restricción de formato, rol, crédito o longitud de contraseña falla.
     * @returns {Promise<Record<string, any>>} Promesa que resuelve con los datos validados, limpios y con la contraseña hasheada.
     */
    private async validar(body: unknown, update: boolean) {
        // Valida y filtra el objeto body mapeando las propiedades requeridas y opcionales de la entidad
        const data = {
            ...validarDatos(
                body,
                update,
                [
                    "nombre",
                    "apellido",
                    "correo",
                    "contrasena",
                    "credito_acumulado",
                    "rol",
                ],
                ["nombre", "apellido", "correo", "contrasena", "rol"],
            ),
        };

        // Validaciones de longitud máxima de texto para evitar desbordamiento en columnas SQL
        texto(data, "nombre", 100);
        texto(data, "apellido", 100);
        texto(data, "correo", 150);

        // Valida que el correo electrónico cumpla con un patrón estándar mediante una Expresión Regular
        if (
            data.correo !== undefined &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo as string)
        ) {
            throw new HttpError(400, "Correo inválido.");
        }

        // Restringe los roles del sistema únicamente a las palabras clave permitidas por el negocio
        if (
            data.rol !== undefined &&
            !["PRODUCTOR", "ASISTENTE"].includes(data.rol as string)
        ) {
            throw new HttpError(400, "Rol inválido.");
        }

        // Control estricto de precisión del valor decimal para el crédito acumulado (máximo 2 decimales y límites de rango)
        if (
            data.credito_acumulado !== undefined &&
            (typeof data.credito_acumulado !== "number" ||
                !Number.isFinite(data.credito_acumulado) ||
                data.credito_acumulado < 0 ||
                data.credito_acumulado > 99999999.99 ||
                Math.abs(
                    data.credito_acumulado * 100 -
                    Math.round(data.credito_acumulado * 100),
                ) > 0.000001)
        ) {
            throw new HttpError(400, "Crédito inválido: máximo dos decimales.");
        }

        // Gestión segura de la contraseña usando bcryptjs con factor de costo 10
        if (data.contrasena !== undefined) {
            texto(data, "contrasena", 72);
            // Bcrypt tiene un límite físico estricto de 72 bytes; caracteres especiales (como emojis) pueden pesar más de 1 byte por carácter
            if (Buffer.byteLength(data.contrasena as string, "utf8") > 72) {
                throw new HttpError(
                    400,
                    "Contraseña supera los 72 bytes permitidos por bcrypt.",
                );
            }
            // Encripta la contraseña de forma asíncrona antes de enviarla a persistir
            data.contrasena = await hash(data.contrasena as string, 10);
        }

        return data;
    }

    /**
     * Registra un nuevo usuario en el sistema tras superar las validaciones de campos obligatorios.
     * @async
     * @param {unknown} body - Objeto de datos del nuevo usuario recibido del cliente.
     * @returns {Promise<any>} Promesa que resuelve con el nuevo usuario guardado en la base de datos.
     */
    async crearUsuario(body: unknown) {
        const data = await this.validar(body, false);
        return this.repository.create(data as unknown as CreateUsuarioDTO);
    }

    /**
     * Modifica parcialmente un usuario existente buscando primero su ID para asegurar integridad.
     * @async
     * @param {number} id - El identificador del usuario a actualizar.
     * @param {unknown} body - Los campos modificados enviados por el cliente.
     * @throws {HttpError} Lanza error 404 si el usuario a modificar no es encontrado.
     * @returns {Promise<any>} Promesa que devuelve el registro actualizado desde la base de datos.
     */
    async actualizarUsuario(id: number, body: unknown) {
        await this.obtenerPorId(id); // Valida la existencia previa del usuario
        const data = await this.validar(body, true);
        const item = await this.repository.update(id, data as UpdateUsuarioDTO);
        if (!item) throw new HttpError(404, "Usuario no encontrado.");
        return item;
    }
}
