import {pool} from '../config/db.js';
import {
    Escenario,
    CreateEscenarioDTO,
    UpdateEscenarioDTO,
} from '../interfaces/escenario.interface.js';

export class EscenarioRepository {
    // 1. READ (Obtener todos los escenarios)
    async findAll() {
        const query = `
            SELECT e.id,
                   e.nombre,
                   e.capacidad,
                   e.id_festival,
                   f.nombre AS nombre_festival
            FROM escenario e
                     JOIN festival f ON e.id_festival = f.id
            ORDER BY e.id ASC;
        `;
        const {rows} = await pool.query(query);
        return rows;
    }

    // 2. READ (Obtener un escenario por su id)
    async findById(id: number) {
        const query = `
            SELECT e.id,
                   e.nombre,
                   e.capacidad,
                   e.id_festival
            FROM escenario e
            WHERE e.id = $1;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows[0];
    }

    // 3. CREATE (Crear un escenario)
    async create(data: CreateEscenarioDTO): Promise<Escenario> {
        const query = `
            INSERT INTO escenario (nombre, capacidad, id_festival)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [data.nombre, data.capacidad, data.id_festival];
        const {rows} = await pool.query(query, values);
        return rows[0];
    }

    // 4. UPDATE (Actualizar un escenario)
    async update(id: number, data: UpdateEscenarioDTO): Promise<Escenario | null> {
        const query = `
            UPDATE escenario
            SET nombre = COALESCE($1, nombre),
                capacidad = COALESCE($2, capacidad),
                id_festival = COALESCE($3, id_festival)
            WHERE id = $4
            RETURNING *;
        `;
        const values = [data.nombre ?? null,
                        data.capacidad ?? null,
                        data.id_festival ?? null,
                        id];
        const {rows} = await pool.query(query, values);
        return rows[0] || null;
    }
    
    // 5. DELETE (Eliminar un escenario)
    async delete(id: number): Promise<Escenario | null> {
        const query = `
            DELETE FROM escenario
            WHERE id = $1
            RETURNING *;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows[0] || null;
    }
}
