import { ReporteRepository } from '../repositories/reporte.repository.js';

export class ReporteService {
    private reporteRepository: ReporteRepository;

    constructor() {
        this.reporteRepository = new ReporteRepository();
    }

    async obtenerVentasOcupacion() {
        const reporte = await this.reporteRepository.getVentasOcupacion();

        if (!reporte || reporte.length === 0) {
            const error: any = new Error('No hay datos de ventas disponibles.');
            error.status = 404;
            throw error;
        }

        return reporte;
    }
}