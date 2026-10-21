import {pool} from "../config/db.js"; // importa la conexión a la base de datos
import {
    Usuario,
    CreateUsuarioDTO,
    UpdateUsuarioDTO,
} from "../interfaces/usuario.interface.js";

/**
 * Repositorio encargado de gestionar el acceso y manipulación de los datos de la tabla 'usuario'.
 */
export class UsuarioRepository {
    /*
      Obtiene un usuario por su correo
    */
    async findByEmail(correo: string): Promise<Usuario> {
        const {rows} = await pool.query(
            "SELECT id, nombre, apellido, correo, contrasena, credito_acumulado, rol, activo FROM usuario WHERE correo = $1;",
            [correo],
        );
        return rows[0] ?? null;
    }

    /**
     * Obtiene todos los usuarios de la base de datos ordenados por su ID.
     * @async
     * @returns {Promise<Usuario[]>} Promesa que resuelve con un arreglo de todos los usuarios encontrados.
     */
    async findAll(): Promise<Usuario[]> {
        const {rows} = await pool.query(
            "SELECT id, nombre, apellido, correo, credito_acumulado, rol, activo FROM usuario ORDER BY id",
        );
        return rows;
    }

    /**
     * Busca un usuario específico por su identificador único.
     * @async
     * @param {number} id - El identificador único del usuario a buscar.
     * @returns {Promise<Usuario | null>} Promesa que resuelve con el objeto Usuario si existe, o null si no es encontrado.
     */
    async findById(id: number): Promise<Usuario | null> {
        const {rows} = await pool.query(
            "SELECT id, nombre, apellido, correo, credito_acumulado, rol, activo FROM usuario WHERE id = $1",
            [id],
        );
        return rows[0] ?? null;
    }

    /**
     * Inserta un nuevo usuario en la base de datos de manera segura contra inyecciones SQL.
     * @async
     * @param {CreateUsuarioDTO} data - Objeto de transferencia de datos con los atributos requeridos para la creación.
     * @returns {Promise<Usuario>} Promesa que resuelve con el registro del usuario recién creado e incluye su ID generado.
     */
    async create(data: CreateUsuarioDTO): Promise<Usuario> {
        const {rows} = await pool.query(
            "INSERT INTO usuario (nombre, apellido, correo, contrasena, credito_acumulado, rol, activo) VALUES ($1, $2, $3, $4, COALESCE($5, 0), $6, COALESCE($7, true)) RETURNING id, nombre, apellido, correo, credito_acumulado, rol, activo",
            [
                data.nombre ?? null,
                data.apellido ?? null,
                data.correo ?? null,
                data.contrasena ?? null,
                data.credito_acumulado ?? null,
                data.rol ?? null,
                data.activo ?? null,
            ],
        );
        return rows[0];
    }

    /**
     * Actualiza parcialmente las propiedades de un usuario existente.
     * Si una propiedad de 'data' es nula o indefinida, conserva el valor original usando COALESCE.
     * @async
     * @param {number} id - El identificador único del usuario a modificar.
     * @param {UpdateUsuarioDTO} data - Objeto con las propiedades que se desean actualizar opcionalmente.
     * @returns {Promise<Usuario | null>} Promesa que resuelve con el usuario modificado o null si el ID especificado no existía.
     */
    async update(id: number, data: UpdateUsuarioDTO): Promise<Usuario | null> {
        const {rows} = await pool.query(
            "UPDATE usuario SET nombre = COALESCE($1, nombre), apellido = COALESCE($2, apellido), correo = COALESCE($3, correo), contrasena = COALESCE($4, contrasena), credito_acumulado = COALESCE($5, credito_acumulado), rol = COALESCE($6, rol) WHERE id = $7 RETURNING id, nombre, apellido, correo, credito_acumulado, rol",
            [
                data.nombre ?? null,
                data.apellido ?? null,
                data.correo ?? null,
                data.contrasena ?? null,
                data.credito_acumulado ?? null,
                data.rol ?? null,
                data.activo ?? null,
                id,
            ],
        );
        return rows[0] ?? null;
    }
}
