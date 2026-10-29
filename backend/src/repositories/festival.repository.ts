import {pool} from '../config/db.js'
import {
    Festival,
    CreateFestivalDTO,
    UpdateFestivalDTO
} from '../interfaces/festival.interface.js'

export class FestivalRepository {
    // 1. READ (Obtener todos los festivales)
    async findAll() {
        const query = `
            SELECT f.id,
                   f.nombre,
                   f.fecha_inicio,
                   f.fecha_fin,
                   CASE
                       WHEN f.estado = 'ACTIVO' AND f.fecha_fin < CURRENT_DATE THEN 'FINALIZADO'
                       ELSE f.estado
                   END AS estado,
                   f.id_recinto,
                   r.nombre AS nombre_recinto,
                   r.ciudad AS ciudad_recinto,
                   r.direccion AS direccion_recinto,
                   f.id_productor,
                   u.nombre AS nombre_productor,
                   u.apellido AS apellido_productor
            FROM festival f
            JOIN recinto r ON r.id = f.id_recinto
            JOIN usuario u ON f.id_productor = u.id
            ORDER BY f.id ASC;
        `;
        const {rows} = await pool.query(query);
        return rows;
    }

    // 2. READ (Obtener un festival por su id)
    async findById(id: number) {
        // Lazy evaluation
        await pool.query(
            `UPDATE festival
             SET estado = 'FINALIZADO'
             WHERE id = $1
               AND estado = 'ACTIVO'
               AND fecha_fin < CURRENT_DATE;
            `, [id]
        );

        const query = `
            SELECT f.id,
                   f.nombre,
                   f.fecha_inicio,
                   f.fecha_fin,
                   f.estado,
                   f.id_recinto,
                   r.nombre AS nombre_recinto,
                   r.ciudad AS ciudad_recinto,
                   r.direccion AS direccion_recinto,
                   f.id_productor,
                   u.nombre AS nombre_productor,
                   u.apellido AS apellido_productor
            FROM festival f
            JOIN recinto r ON r.id = f.id_recinto
            JOIN usuario u ON f.id_productor = u.id
            WHERE f.id = $1;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows[0] || null;
    }

    // 3. CREATE (Crear un festival)
    async create(data: CreateFestivalDTO): Promise<Festival> {
        const query = `
            INSERT INTO festival (nombre, fecha_inicio, fecha_fin, estado, id_recinto, id_productor)
            VALUES ($1, $2, $3, COALESCE($4, 'ACTIVO'), $5, $6)
            RETURNING *;
        `;
        const values = [
            data.nombre,
            data.fecha_inicio,
            data.fecha_fin,
            data.estado ?? null,
            data.id_recinto,
            data.id_productor,
        ];
        const {rows} = await pool.query(query, values);
        return rows[0];
    }

    // 4. UPDATE (Actualizar un festival)
    async update(id: number, data: UpdateFestivalDTO): Promise<Festival | null> {
        const query = `
            UPDATE festival
            SET nombre       = COALESCE($1, nombre),
                fecha_inicio = COALESCE($2, fecha_inicio),
                fecha_fin    = COALESCE($3, fecha_fin),
                estado       = COALESCE($4, estado),
                id_recinto   = COALESCE($5, id_recinto),
                id_productor = COALESCE($6, id_productor)
            WHERE id = $7
            RETURNING *;
        `;
        const values = [
            data.nombre ?? null,
            data.fecha_inicio ?? null,
            data.fecha_fin ?? null,
            data.estado ?? null,
            data.id_recinto ?? null,
            data.id_productor ?? null,
            id,
        ];
        const {rows} = await pool.query(query, values);
        return rows[0] || null;
    }

    // 5. DELETE (Eliminar un festival)
    async delete(id: number): Promise<Festival | null> {
        const query = `
            DELETE
            FROM festival
            WHERE id = $1
            RETURNING *;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows[0] || null;
    }
}