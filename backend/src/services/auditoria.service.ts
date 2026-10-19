import { AuditoriaRepository } from '../repositories/auditoria.repository.js';

export class AuditoriaService {
    private auditoriaRepository: AuditoriaRepository;

    constructor() {
        this.auditoriaRepository = new AuditoriaRepository();
    }

    async obtenerTodos() {
        return await this.auditoriaRepository.findAll();
    }

    async obtenerPorId(id: number) {
        const registro = await this.auditoriaRepository.findById(id);

        if (!registro) {
            const error: any = new Error('Registro de auditoría no encontrado.');
            error.status = 404;
            throw error;
        }

        return registro;
    }
}