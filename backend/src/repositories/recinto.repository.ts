import {pool} from '../config/db.js';
import {
    Recinto,
    CreateRecintoDTO,
    UpdateRecintoDTO,
} from '../interfaces/recinto.interface.js';

export class RecintoRepository {
    async findAll(): Promise<Recinto[]> {
        const query = `SELECT id, nombre, direccion, ciudad, capacidad FROM recinto ORDER BY id ASC;`;
        const {rows} = await pool.query(query);
        return rows;
    }

    async findById(id: number): Promise<Recinto | undefined> {
        const query = `SELECT id, nombre, direccion, ciudad, capacidad FROM recinto WHERE id = $1;`;
        const {rows} = await pool.query(query, [id]);
        return rows[0];
    }

    async create(data: CreateRecintoDTO): Promise<Recinto> {
        const query = `
            INSERT INTO recinto (nombre, direccion, ciudad, capacidad)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [data.nombre, data.direccion, data.ciudad, data.capacidad];
        const {rows} = await pool.query(query, values);
        return rows[0];
    }

    async update(id: number, data: UpdateRecintoDTO): Promise<Recinto | null> {
        const query = `
            UPDATE recinto
            SET nombre    = COALESCE($1, nombre),
                direccion = COALESCE($2, direccion),
                ciudad = COALESCE($3, ciudad),
                capacidad = COALESCE($4, capacidad)
            WHERE id = $5
            RETURNING *;
        `;
        const values = [data.nombre ?? null, data.direccion ?? null, data.ciudad ?? null, data.capacidad ?? null, id];
        const {rows} = await pool.query(query, values);
        return rows[0] || null;
    }

    async delete(id: number): Promise<Recinto | null> {
        const query = `DELETE
                       FROM recinto
                       WHERE id = $1
                       RETURNING *;`;
        const {rows} = await pool.query(query, [id]);
        return rows[0] || null;
    }
}