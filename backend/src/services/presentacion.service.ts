import { PresentacionRepository } from '../repositories/presentacion.repository.js';
import {
    CreatePresentacionDTO,
    UpdatePresentacionDTO,
} from '../types/presentacion.types.js';

export class PresentacionService {
    private presentacionRepository: PresentacionRepository;

    constructor() {
        this.presentacionRepository = new PresentacionRepository();
    }

    async obtenerTodas() {
        return await this.presentacionRepository.findAll();
    }

    async obtenerPorId(id: number) {
        const presentacion = await this.presentacionRepository.findById(id);
        if (!presentacion) {
            const error: any = new Error('Presentación no encontrada.');
            error.status = 404;
            throw error;
        }
        return presentacion;
    }

    async crearPresentacion(data: CreatePresentacionDTO) {
        // Validación de fechas
        if (new Date(data.fecha_fin) <= new Date(data.fecha_inicio)) {
            const error: any = new Error('La fecha de término debe ser posterior a la fecha de inicio.');
            error.status = 400;
            throw error;
        }

        return await this.presentacionRepository.create(data);
    }

    async actualizarPresentacion(id: number, data: UpdatePresentacionDTO) {
        const actualizada = await this.presentacionRepository.update(id, data);
        if (!actualizada) {
            const error: any = new Error('Presentación no encontrada.');
            error.status = 404;
            throw error;
        }
        return actualizada;
    }

    async eliminarPresentacion(id: number) {
        const eliminada = await this.presentacionRepository.delete(id);
        if (!eliminada) {
            const error: any = new Error('Presentación no encontrada.');
            error.status = 404;
            throw error;
        }
        return eliminada;
    }
}