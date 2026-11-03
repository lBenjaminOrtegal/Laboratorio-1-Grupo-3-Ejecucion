import {pool} from '../config/db.js';
import {
    Ticket,
    ResultadoAccesoTicket,
    CreateTicketDTO,
    UpdateTicketDTO,
    BuyTicketDTO,
} from '../interfaces/ticket.interface.js';

export class TicketRepository {
    // 1. READ (Obtener todos los tickets)
    async findAll() {
        const query = `
            SELECT t.id,
                   t.id_orden_compra,
                   t.estado,
                   t.codigo_unico,
                   t.fecha_uso,
                   t.id_tipo_entrada
            FROM ticket t
            ORDER BY t.id_orden_compra ASC, t.id ASC;
        `;
        const {rows} = await pool.query(query);
        return rows;
    }

    // 2. READ (Obtener un ticket por su clave compuesta: id_orden_compra, id)
    async findById(idOrdenCompra: number, id: number) {
        const query = `
            SELECT t.id,
                   t.id_orden_compra,
                   t.estado,
                   t.codigo_unico,
                   t.fecha_uso,
                   t.id_tipo_entrada
            FROM ticket t
            WHERE t.id_orden_compra = $1
              AND t.id = $2;
        `;
        const {rows} = await pool.query(query, [idOrdenCompra, id]);
        return rows[0] || null;
    }

    /**
     * Registra el acceso (validación) de un ticket
     * - Busca ticket por código_unico
     * - Usa transacción y bloqueo (FOR UPDATE) para evitar race conditions
     * - Marca como UTILIZADO y asigna fecha_uso si es válido
     * - Incluye nombre del tipo de entrada en la respuesta
     * - Si ya fue utilizado, devuelve su información
     * 
     * @param codigo - Código único del ticket (max 64 caracteres)
     * @returns ResultadoAccesoTicket con estado y datos del ticket si es válido
     */
    async registrarAcceso(codigo: string): Promise<ResultadoAccesoTicket> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const {rows} = await client.query<Ticket>( 
                'SELECT * FROM ticket WHERE codigo_unico = $1 FOR UPDATE',
                [codigo],
            );
            const ticket = rows[0];
            let resultado: ResultadoAccesoTicket;
            
            if (!ticket) { 
                resultado = {resultado: 'NO_ENCONTRADO'}; 
            } else if (ticket.estado === 'ANULADO') {
                resultado = {resultado: 'ANULADO'};
            } else if (ticket.estado === 'UTILIZADO') {
                // Si estado es UTILIZADO, obtener datos enriquecidos del ticket
                const enriquecido = await client.query<any>(
                    `SELECT t.id, t.id_orden_compra, t.estado, t.codigo_unico, t.fecha_uso, t.id_tipo_entrada,
                            te.nombre as tipo_entrada_nombre
                     FROM ticket t
                     LEFT JOIN tipo_entrada te ON t.id_tipo_entrada = te.id
                     WHERE t.codigo_unico = $1`,
                    [codigo],
                );
                resultado = {resultado: 'UTILIZADO', ticket: enriquecido.rows[0]};
            } else {
                // ticket.estado === 'VALIDO'
                await client.query(
                    `UPDATE ticket SET estado = 'UTILIZADO', fecha_uso = CURRENT_TIMESTAMP
                     WHERE codigo_unico = $1`,
                    [codigo],
                );
                // Obtener el ticket actualizado con info enriquecida
                const enriquecido = await client.query<any>(
                    `SELECT t.id, t.id_orden_compra, t.estado, t.codigo_unico, t.fecha_uso, t.id_tipo_entrada,
                            te.nombre as tipo_entrada_nombre
                     FROM ticket t
                     LEFT JOIN tipo_entrada te ON t.id_tipo_entrada = te.id
                     WHERE t.codigo_unico = $1`,
                    [codigo],
                );
                resultado = {resultado: 'ACEPTADO', ticket: enriquecido.rows[0]!};
            }
            await client.query('COMMIT');
            return resultado;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // 3. CREATE (Crear un ticket)
    async create(data: CreateTicketDTO): Promise<Ticket> {
        const query = `
            INSERT INTO ticket (id, id_orden_compra, estado, codigo_unico, fecha_uso, id_tipo_entrada)
            VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM ticket WHERE id_orden_compra = $1),
                    $1,
                    COALESCE($2, 'VALIDO'),
                    $3,
                    $4,
                    $5)
            RETURNING *;
        `;
        const values = [
            data.id_orden_compra,
            data.estado ?? null,
            data.codigo_unico,
            data.fecha_uso ?? null,
            data.id_tipo_entrada,
        ];
        const {rows} = await pool.query(query, values);
        return rows[0];
    }

    // 4. UPDATE (Actualizar un ticket)
    async update(idOrdenCompra: number, id: number, data: UpdateTicketDTO): Promise<Ticket | null> {
        const query = `
            UPDATE ticket
            SET estado          = COALESCE($1, estado),
                codigo_unico    = COALESCE($2, codigo_unico),
                fecha_uso       = COALESCE($3, fecha_uso),
                id_tipo_entrada = COALESCE($4, id_tipo_entrada)
            WHERE id_orden_compra = $5
              AND id = $6
              AND estado = 'VALIDO'
              AND fecha_uso IS NULL
            RETURNING *;
        `;
        const values = [
            data.estado ?? null,
            data.codigo_unico ?? null,
            data.fecha_uso ?? null,
            data.id_tipo_entrada ?? null,
            idOrdenCompra,
            id,
        ];
        const {rows} = await pool.query(query, values);
        return rows[0] || null;
    }

    // 5. DELETE (Eliminar un ticket)
    async delete(idOrdenCompra: number, id: number): Promise<Ticket | null> {
        const query = `
            DELETE
            FROM ticket
            WHERE id_orden_compra = $1
              AND id = $2
            RETURNING *;
        `;
        const {rows} = await pool.query(query, [idOrdenCompra, id]);
        return rows[0] || null;
    }

    /**
     * Obtiene todos los tickets de un usuario específico
     * - Busca mediante orden_compra.id_asistente
     * - Incluye nombre del tipo de entrada (JOIN con tipo_entrada)
     * - Retorna tickets ordenados por orden_compra e id
     * 
     * @param idUsuario - ID del usuario (asistente)
     * @returns Array de tickets del usuario con información enriquecida
     */
    async findByUsuario(idUsuario: number): Promise<any[]> {
        const query = `
            SELECT t.id,
                   t.id_orden_compra,
                   t.estado,
                   t.codigo_unico,
                   t.fecha_uso,
                   t.id_tipo_entrada,
                   te.nombre as tipo_entrada_nombre
            FROM ticket t
            INNER JOIN orden_compra oc ON t.id_orden_compra = oc.id
            LEFT JOIN tipo_entrada te ON t.id_tipo_entrada = te.id
            WHERE oc.id_asistente = $1
            ORDER BY t.id_orden_compra ASC, t.id ASC;
        `;
        const {rows} = await pool.query(query, [idUsuario]);
        return rows;
    }

    /**
     * Ejecuta el Procedimiento Almacenado 1 (comprar_entradas)
     * - Valida stock, crea la orden, genera N tickets y descuenta aforo en BD
     * - Retorna el ID de la orden generada junto con el listado de tickets emitidos
     *
     * @param data Datos de la compra (BuyTicketDTO)
     * @returns Objeto con id_orden_compra, cantidad_tickets y el arreglo de tickets creados
     */
    async buy(data: BuyTicketDTO): Promise<any[]> {
        const callQuery = `
            CALL comprar_entradas($1, $2, $3, $4);
        `;
        const values = [
            data.id_asistente,
            data.id_tipo_entrada,
            data.cantidad,
            data.metodo_pago,
        ];
        await pool.query(callQuery, values);

        const selectQuery = `
            SELECT t.id,
                   t.id_orden_compra,
                   t.estado,
                   t.codigo_unico,
                   t.fecha_uso,
                   t.id_tipo_entrada,
                   te.nombre as tipo_entrada_nombre
            FROM ticket t
            INNER JOIN orden_compra oc ON t.id_orden_compra = oc.id
            LEFT JOIN tipo_entrada te ON t.id_tipo_entrada = te.id
            WHERE oc.id = (
                SELECT MAX(id) FROM orden_compra WHERE id_asistente = $1
            )
            ORDER BY t.id ASC;
        `;
        const {rows} = await pool.query(selectQuery, [data.id_asistente]);
        return rows;
    }
}