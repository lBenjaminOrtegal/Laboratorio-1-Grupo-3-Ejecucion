import {ArtistaRepository} from '../repositories/artista.repository.js';
import {
    CreateArtistaDTO,
    UpdateArtistaDTO,
} from '../interfaces/artista.interface.js';

export class ArtistaService {
    private artistaRepository: ArtistaRepository;

    constructor() {
        this.artistaRepository = new ArtistaRepository();
    }

    async obtenerTodos() {
        return await this.artistaRepository.findAll();
    }

    async obtenerPorId(id: number) {
        const artista = await this.artistaRepository.findById(id);

        if (!artista) {
            const error: any = new Error('Artista no encontrado.');
            error.status = 404;
            throw error;
        }

        return artista;
    }

    async crearArtista(data: CreateArtistaDTO) {
        return await this.artistaRepository.create(data);
    }

    async actualizarArtista(id: number, data: UpdateArtistaDTO) {
        const actualizada = await this.artistaRepository.update(id, data);

        if (!actualizada) {
            const error: any = new Error('Artista no encontrado.');
            error.status = 404;
            throw error;
        }

        return actualizada;
    }

    async eliminarArtista(id: number) {
        const eliminada = await this.artistaRepository.delete(id);
        if (!eliminada) {
            const error: any = new Error('Artista no encontrado.');
            error.status = 404;
            throw error;
        }

        return {message: 'Artista eliminado correctamente.'};
    }
}