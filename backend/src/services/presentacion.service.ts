import { PresentacionRepository } from '../repositories/presentacion.repository.js';
import { CreatePresentacionDTO, UpdatePresentacionDTO, } from '../interfaces/presentacion.interface.js'

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

    async obtenerGrilla(id_festival: number, fecha: string) {
        const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
        if (!regexFecha.test(fecha)) {
            const error: any = new Error('El formato de la fecha debe ser YYYY-MM-DD.');
            error.status = 400;
            throw error;
        }

        const presentaciones = await this.presentacionRepository.line_up(id_festival, fecha);

        const mapa = new Map<number, any>();

        for (const presentacion of presentaciones) {
            if (!mapa.has(presentacion.id_escenario)) {
                mapa.set(presentacion.id_escenario, {
                    id_escenario: presentacion.id_escenario,
                    nombre_escenario: presentacion.nombre_escenario,
                    presentaciones: [],
                });
            }
            mapa.get(presentacion.id_escenario)!.presentaciones.push(presentacion);
        }

        return Array.from(mapa.values());
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

    async cancelarPresentacion(id_presentacion: number, id_productor: number): Promise<void> {
        if (!Number.isInteger(id_presentacion) || id_presentacion <= 0 || id_presentacion > 2147483647) {
            const error: any = new Error('El ID de la presentación debe ser un entero positivo válido.');
            error.status = 400;
            throw error;
        }

        if (!Number.isInteger(id_productor) || id_productor <= 0 || id_productor > 2147483647) {
            const error: any = new Error('El ID del productor debe ser un entero positivo válido.');
            error.status = 400;
            throw error;
        }

        await this.presentacionRepository.cancelar(id_presentacion, id_productor);
    }
}