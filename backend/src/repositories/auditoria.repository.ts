import {pool} from '../config/db.js';
import {Auditoria} from '../interfaces/auditoria.interface.js';

export class AuditoriaRepository {
    async findAll(): Promise<Auditoria[]> {
        const query = `SELECT *
                       FROM auditoria
                       ORDER BY fecha_modificacion DESC;`;
        const {rows} = await pool.query(query);
        return rows;
    }

    async findById(id: number): Promise<Auditoria | undefined> {
        const query = `SELECT *
                       FROM auditoria
                       WHERE id = $1;`;
        const {rows} = await pool.query(query, [id]);
        return rows[0];
    }
}