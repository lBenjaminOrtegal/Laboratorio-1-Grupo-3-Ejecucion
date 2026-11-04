import { Request, Response, NextFunction } from 'express';
import { ReporteService } from '../services/reporte.service.js';

const reporteService = new ReporteService();

export class ReporteController {
    /*
        GET
        /api/reportes/ventas-ocupacion
        Obtiene el reporte de recaudación y aforo por festival y tipo de entrada
    */
    async getVentasOcupacion(req: Request, res: Response, next: NextFunction) {
        try {
            const reporte = await reporteService.obtenerVentasOcupacion();

            return res.status(200).json({
                mensaje: 'Reporte de ventas obtenido con éxito.',
                data: reporte,
            });
        } catch (error) {
            next(error);
        }
    }
}