import {FestivalRepository} from '../repositories/festival.repository.js';
import {
    CreateFestivalDTO,
    UpdateFestivalDTO,
} from '../interfaces/festival.interface.js';

export class FestivalService {
    private festivalRepository: FestivalRepository;

    constructor() {
        this.festivalRepository = new FestivalRepository();
    }

    async obtenerTodos() {
        return await this.festivalRepository.findAll();
    }

    async obtenerPorId(id: number) {
        const festival = await this.festivalRepository.findById(id);
        if (!festival) {
            const error: any = new Error('Festival no encontrado.');
            error.status = 404;
            throw error;
        }
        return festival;
    }

    async crearFestival(data: CreateFestivalDTO) {
        if (new Date(data.fecha_fin) < new Date(data.fecha_inicio)) {
            const error: any = new Error('La fecha de fin no puede ser anterior a la fecha de inicio.');
            error.status = 400;
            throw error;
        }
        return await this.festivalRepository.create(data);
    }

    async actualizarFestival(id: number, data: UpdateFestivalDTO) {
        // Si se envían ambas fechas deben tener un rango válido
        if (
            data.fecha_inicio !== undefined &&
            data.fecha_fin !== undefined &&
            new Date(data.fecha_fin) < new Date(data.fecha_inicio)
        ) {
            const error: any = new Error('La fecha de fin no puede ser anterior a la fecha de inicio.');
            error.status = 400;
            throw error;
        }

        const actualizado = await this.festivalRepository.update(id, data);
        if (!actualizado) {
            const error: any = new Error('Festival no encontrado.');
            error.status = 404;
            throw error;
        }
        return actualizado;
    }

    async eliminarFestival(id: number) {
        const eliminado = await this.festivalRepository.delete(id);
        if (!eliminado) {
            const error: any = new Error('Festival no encontrado.');
            error.status = 404;
            throw error;
        }
        return eliminado;
    }
}