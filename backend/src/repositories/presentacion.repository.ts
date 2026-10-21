import {pool} from '../config/db.js';
import {
    Presentacion,
    CreatePresentacionDTO,
    UpdatePresentacionDTO,
} from '../interfaces/presentacion.interface.js';

export class PresentacionRepository {
    // 1. READ (Obtener todas las presentaciones)
    async findAll() {
        const query = `
            SELECT p.id     AS id_presentacion,
                   p.fecha_inicio,
                   p.fecha_fin,
                   p.estado,
                   p.id_artista,
                   a.nombre AS artista_nombre,
                   a.genero AS artista_genero,
                   p.id_escenario,
                   e.nombre AS escenario_nombre,
                   e.id_festival,
                   f.nombre AS festival_nombre
            FROM presentacion p
                     JOIN artista a ON p.id_artista = a.id
                     JOIN escenario e ON p.id_escenario = e.id
                     JOIN festival f ON e.id_festival = f.id
            ORDER BY p.fecha_inicio ASC;
        `;
        const {rows} = await pool.query(query);
        return rows;
    }

    // 2. READ (Obtener una presentacion por su id)
    async findById(id: number) {
        const query = `
            SELECT p.id,
                   p.fecha_inicio,
                   p.fecha_fin,
                   p.estado,
                   p.id_artista,
                   a.nombre AS artista_nombre,
                   p.id_escenario,
                   e.nombre AS escenario_nombre,
                   e.id_festival
            FROM presentacion p
                     JOIN artista a ON p.id_artista = a.id
                     JOIN escenario e ON p.id_escenario = e.id
            WHERE p.id = $1;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows[0] || null;
    }

    // 3. CREATE (Crear una presentacion)
    // Se requiere fecha_inicio, fecha_fin, estado, id_artista, id_escenario
    async create(data: CreatePresentacionDTO): Promise<Presentacion> {
        const query = `
            INSERT INTO presentacion (fecha_inicio, fecha_fin, estado, id_artista, id_escenario)
            VALUES ($1, $2, COALESCE($3, 'PROGRAMADA'), $4, $5) RETURNING *;
        `;
        const values = [
            data.fecha_inicio,
            data.fecha_fin,
            data.estado || 'PROGRAMADA',
            data.id_artista,
            data.id_escenario,
        ];
        const {rows} = await pool.query(query, values);
        return rows[0];
    }

    // 4. UPDATE (Actualizar una presentacion, se requiere el id de la presentacion a actualizar)
    // Se requiere fecha_inicio, fecha_fin, estado, id_artista, id_escenario, id
    async update(id: number, data: UpdatePresentacionDTO): Promise<Presentacion | null> {
        const query = `
            UPDATE presentacion
            SET fecha_inicio = COALESCE($1, fecha_inicio),
                fecha_fin    = COALESCE($2, fecha_fin),
                estado       = COALESCE($3, estado),
                id_artista   = COALESCE($4, id_artista),
                id_escenario = COALESCE($5, id_escenario)
            WHERE id = $6
            RETURNING *;
        `;
        const values = [
            data.fecha_inicio ?? null,
            data.fecha_fin ?? null,
            data.estado ?? null,
            data.id_artista ?? null,
            data.id_escenario ?? null,
            id,
        ];
        const {rows} = await pool.query(query, values);
        return rows[0] || null;
    }

    // 5. DELETE (Eliminar una presentacion)
    // Se requiere el id de la presentación a eliminar
    async delete(id: number): Promise<Presentacion | null> {
        const query = `
            DELETE
            FROM presentacion
            WHERE id = $1
            RETURNING *;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows[0] || null;
    }
}