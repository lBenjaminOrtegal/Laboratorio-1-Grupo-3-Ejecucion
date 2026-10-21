import {RecintoRepository} from '../repositories/recinto.repository.js';
import {
    CreateRecintoDTO,
    UpdateRecintoDTO,
} from '../interfaces/recinto.interface.js';

export class RecintoService {
    private recintoRepository: RecintoRepository;

    constructor() {
        this.recintoRepository = new RecintoRepository();
    }

    async obtenerTodos() {
        return await this.recintoRepository.findAll();
    }

    async obtenerPorId(id: number) {
        const recinto = await this.recintoRepository.findById(id);

        if (!recinto) {
            const error: any = new Error('Recinto no encontrado.');
            error.status = 404;
            throw error;
        }

        return recinto;
    }

    async crearRecinto(data: CreateRecintoDTO) {
        // Validacion de capacidad
        if (data.capacidad <= 0) {
            const error: any = new Error('La capacidad del recinto debe ser un número positivo.');
            error.status = 400;
            throw error;
        }

        return await this.recintoRepository.create(data);
    }

    async actualizarRecinto(id: number, data: UpdateRecintoDTO) {
        // Validacion de capacidad
        if (data.capacidad !== undefined && data.capacidad <= 0) {
            const error: any = new Error('La capacidad del recinto debe ser un número positivo.');
            error.status = 400;
            throw error;
        }

        const actualizada = await this.recintoRepository.update(id, data);

        if (!actualizada) {
            const error: any = new Error('Recinto no encontrado.');
            error.status = 404;
            throw error;
        }

        return actualizada;
    }

    async eliminarRecinto(id: number) {
        const eliminada = await this.recintoRepository.delete(id);
        if (!eliminada) {
            const error: any = new Error('Recinto no encontrado.');
            error.status = 404;
            throw error;
        }

        return {message: 'Recinto eliminado correctamente.'};
    }
}