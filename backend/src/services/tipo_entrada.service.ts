import {TipoEntradaRepository} from '../repositories/tipo_entrada.repository.js';
import {
    CreateTipoEntradaDTO,
    UpdateTipoEntradaDTO,
} from '../interfaces/tipo_entrada.interface.js'

export class TipoEntradaService {
    private tipoEntradaRepository: TipoEntradaRepository;

    constructor() {
        this.tipoEntradaRepository = new TipoEntradaRepository();
    }

    async obtenerTodas() {
        return await this.tipoEntradaRepository.findAll();
    }

    async obtenerPorId(id: number) {
        const tipoEntrada = await this.tipoEntradaRepository.findById(id);
        if (!tipoEntrada) {
            const error: any = new Error('Tipo de entrada no encontrado.');
            error.status = 404;
            throw error;
        }
        return tipoEntrada;
    }

    async crearTipoEntrada(data: CreateTipoEntradaDTO) {
        return await this.tipoEntradaRepository.create(data);
    }

    async actualizarTipoEntrada(id: number, data: UpdateTipoEntradaDTO) {
        const actualizada = await this.tipoEntradaRepository.update(id, data);
        if (!actualizada) {
            const error: any = new Error('Tipo de entrada no encontrado.');
            error.status = 404;
            throw error;
        }
        return actualizada;
    }

    async eliminarTipoEntrada(id: number) {
        const eliminada = await this.tipoEntradaRepository.delete(id);
        if (!eliminada) {
            const error: any = new Error('Tipo de entrada no encontrado.');
            error.status = 404;
            throw error;
        }
        return eliminada;
    }
}