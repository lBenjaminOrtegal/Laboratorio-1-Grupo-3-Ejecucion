import {pool} from '../config/db.js';
import {
    Ticket,
    ResultadoAccesoTicket,
    CreateTicketDTO,
    UpdateTicketDTO,
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

    // La misma conexión mantiene la transacción y el bloqueo del ticket.
    async registrarAcceso(codigo: string): Promise<ResultadoAccesoTicket> {
        const client = await pool.connect(); // creamos un cliente para manejar la transacción 
        try {
            await client.query('BEGIN');
            const {rows} = await client.query<Ticket>( 
                'SELECT * FROM ticket WHERE codigo_unico = $1 FOR UPDATE', // for update bloquea la fila para que otros procesos no puedan modificarla hasta que se haga commit o rollback
                [codigo],
            );
            const ticket = rows[0];
            let resultado: ResultadoAccesoTicket; // variable cuyo valor va a mutar o reasignarse a lo largo de la ejecución del bloque try/catch.
            if (!ticket) { 
                resultado = {resultado: 'NO_ENCONTRADO'}; 
            } else if (ticket.estado === 'ANULADO') {
                resultado = {resultado: 'ANULADO'};
            } else if (ticket.estado === 'UTILIZADO' || ticket.fecha_uso !== null) { // si existe fecha_uso, significa que el ticket ya fue utilizado
                resultado = {resultado: 'UTILIZADO'}; 
            } else {
                const actualizado = await client.query<Ticket>(
                    `UPDATE ticket SET estado = 'UTILIZADO', fecha_uso = CURRENT_TIMESTAMP
                     WHERE codigo_unico = $1 RETURNING *`,
                    [codigo],
                );
                resultado = {resultado: 'ACEPTADO', ticket: actualizado.rows[0]!};
            }
            await client.query('COMMIT'); // si todo salió bien, se hace commit de la transacción
            return resultado;
        } catch (error) {
            await client.query('ROLLBACK'); // si hubo un error, se hace rollback de la transacción
            throw error;
        } finally {
            client.release(); // se cierra la conexión
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
}