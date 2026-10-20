import {pool} from '../config/db.js';
import {
    OrdenCompra,
    CreateOrdenCompraDTO,
    UpdateOrdenCompraDTO,
} from '../interfaces/orden_compra.interface.js';

export class OrdenCompraRepository {

    // 1. READ (Obtener todas las órdenes de compra)
    async findAll() {
        const query = `
            SELECT oc.id,
                   oc.fecha_compra,
                   oc.monto,
                   oc.metodo_pago,
                   oc.estado,
                   oc.id_asistente
            FROM orden_compra oc
            ORDER BY oc.id ASC;
        `;
        const {rows} = await pool.query(query);
        return rows;
    }

    // 2. READ (Obtener una orden de compra por su id)
    async findById(id: number) {
        const query = `
            SELECT oc.id, oc.fecha_compra, oc.monto, oc.metodo_pago, oc.estado, oc.id_asistente
            FROM orden_compra oc
            WHERE oc.id = $1;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows[0];
    }

    // 3. CREATE (Crear una orden de compra)
    async create(data: CreateOrdenCompraDTO): Promise<OrdenCompra> {
        const query = `
            INSERT INTO orden_compra (monto, metodo_pago, estado, id_asistente)
            VALUES ($1, $2, COALESCE($3, 'PENDIENTE'), $4) RETURNING *;
        `;
        const values = [data.monto, 
                        data.metodo_pago, 
                        data.estado ?? null, 
                        data.id_asistente
                    ];
        const {rows} = await pool.query(query, values);
        return rows[0];
    }

    // 4. UPDATE (Actualizar una orden de compra)
    async update(id: number, data: UpdateOrdenCompraDTO): Promise<OrdenCompra | null> {
        const query = `
            UPDATE orden_compra
            SET monto = COALESCE($1, monto),    
                metodo_pago = COALESCE($2, metodo_pago),
                estado = COALESCE($3, estado),
                id_asistente = COALESCE($4, id_asistente)
            WHERE id = $5
            RETURNING *;
        `;
        const values = [data.monto ?? null,
            data.metodo_pago ?? null,
            data.estado ?? null,
            data.id_asistente ?? null,
            id,
        ];
        const {rows} = await pool.query(query, values);
        return rows[0] || null;
    }

    // 5. DELETE (Eliminar una orden de compra)
    async delete(id: number): Promise<OrdenCompra | null> {
        const query = `
            DELETE FROM orden_compra
            WHERE id = $1
            RETURNING *;
        `;
        const {rows} = await pool.query(query, [id]);
        return rows[0] || null;
    }
}