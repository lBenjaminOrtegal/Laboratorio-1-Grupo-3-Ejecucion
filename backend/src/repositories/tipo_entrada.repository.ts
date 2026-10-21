import {pool} from '../config/db.js';
import {
    TipoEntrada,
    CreateTipoEntradaDTO,
    UpdateTipoEntradaDTO,
} from '../interfaces/tipo_entrada.interface.js';

export class TipoEntradaRepository {
    // 1. READ (Obtener todos los tipos de entradas)
    async findAll() {
        const query = `
            SELECT te.id,
                   te.nombre,
                   te.descripcion,
                   te.precio,
                   te.stock_inicial,
                   te.stock_disponible,
                   te.fecha_acceso,
                   te.id_festival,
                   f.nombre AS nombre_festival
            FROM tipo_entrada te
                     JOIN festival f on f.id = te.id_festival
            ORDER BY f.nombre, te.precio DESC;
        `;
        const {rows} = await pool.query(query);
        return rows;
    }

    // 2. READ (Obtener un tipo de entrada por su id)
    async findById(id: number) {
        const query = `
            SELECT te.id,
                   te.nombre,
                   te.descripcion,
                   te.precio,
                   te.stock_inicial,
                   te.stock_disponible,
                   te.fecha_acceso,
                   te.id_festival,
                   f.nombre AS nombre_festival
            FROM tipo_entrada te
                     JOIN festival f on f.id = te.id_festival
            WHERE te.id = $1;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows[0] || null;
    }

    // 3. CREATE (Crear un tipo de entrada)
    // Se requiere nombre, descripcion, precio, stock_inicial, stock_disponible, fecha_acceso, id_festival
    async create(data: CreateTipoEntradaDTO): Promise<TipoEntrada> {
        const query = `
            INSERT INTO tipo_entrada (nombre, descripcion, precio, stock_inicial, stock_disponible, fecha_acceso, id_festival)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [
            data.nombre,
            data.descripcion,
            data.precio,
            data.stock_inicial,
            data.stock_disponible,
            data.fecha_acceso,
            data.id_festival,
        ];
        const {rows} = await pool.query(query, values);
        return rows[0];
    }

    // 4. UPDATE (Actualizar un tipo de entrada, se requiere el id del tipo de entrada a actualizar)
    // Se requiere nombre, descripcion, precio, stock_inicial, stock_disponible, fecha_acceso, id_festival, id
    async update(id: number, data: UpdateTipoEntradaDTO): Promise<TipoEntrada | null> {
        const query = `
            UPDATE tipo_entrada
            SET nombre           = COALESCE($1, nombre),
                descripcion      = COALESCE($2, descripcion),
                precio           = COALESCE($3, precio),
                stock_inicial    = COALESCE($4, stock_inicial),
                stock_disponible = COALESCE($5, stock_disponible),
                fecha_acceso     = COALESCE($6, fecha_acceso),
                id_festival      = COALESCE($7, id_festival)
            WHERE id = $8
            RETURNING *;
        `;
        const values = [
            data.nombre ?? null,
            data.descripcion ?? null,
            data.precio ?? null,
            data.stock_inicial ?? null,
            data.stock_disponible ?? null,
            data.fecha_acceso ?? null,
            data.id_festival ?? null,
            id,
        ];
        const {rows} = await pool.query(query, values);
        return rows[0] || null;
    }

    // 5. DELETE (Eliminar un tipo de entrada)
    // Se requiere el id del tipo de entrada a eliminar
    async delete(id: number): Promise<TipoEntrada | null> {
        const query = `
            DELETE
            FROM tipo_entrada
            WHERE id = $1
            RETURNING *;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows[0] || null;
    }
}