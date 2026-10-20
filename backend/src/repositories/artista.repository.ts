import { pool } from '../config/db.js';
import {
    Artista,
    CreateArtistaDTO,
    UpdateArtistaDTO,
} from '../interfaces/artista.interface.js';

export class ArtistaRepository {
    async findAll(): Promise<Artista[]> {
        const query = `SELECT id, nombre, genero, pais FROM artista ORDER BY id ASC;`;
        const { rows } = await pool.query(query);
        return rows;
    }

    async findById(id: number): Promise<Artista | undefined> {
        const query = `SELECT id, nombre, genero, pais FROM artista WHERE id = $1;`;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    async create(data: CreateArtistaDTO): Promise<Artista> {
        const query = `INSERT INTO artista (nombre, genero, pais) VALUES ($1, $2, $3) RETURNING *;`;
        const values = [data.nombre, data.genero, data.pais];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async update(id: number, data: UpdateArtistaDTO): Promise<Artista | null> {
        const query = `
            UPDATE artista
            SET nombre = COALESCE($1, nombre),
                genero = COALESCE($2, genero),
                pais = COALESCE($3, pais)
            WHERE id = $4
            RETURNING *;
        `;
        const values = [data.nombre ?? null, data.genero ?? null, data.pais ?? null, id];
        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    }

    async delete(id: number): Promise<Artista | null> {
        const query = `DELETE FROM artista WHERE id = $1 RETURNING *;`;
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    }
}