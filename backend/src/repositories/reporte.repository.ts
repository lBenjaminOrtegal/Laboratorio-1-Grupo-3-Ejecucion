import { pool } from '../config/db.js';
import { ReporteVentasOcupacion } from '../interfaces/reporte.interface.js';

export class ReporteRepository {
    async getVentasOcupacion(): Promise<ReporteVentasOcupacion[]> {
        const query = `
            SELECT *
            FROM mv_ventas_ocupacion_festival
            ORDER BY id_festival ASC, id_tipo_entrada ASC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }
}