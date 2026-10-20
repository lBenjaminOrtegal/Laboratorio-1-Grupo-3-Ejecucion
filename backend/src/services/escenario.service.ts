import {EscenarioRepository} from "../repositories/escenario.repository.js";
import {
    CreateEscenarioDTO,
    UpdateEscenarioDTO,
} from "../interfaces/escenario.interface.js";

export class EscenarioService {
    private escenarioRepository: EscenarioRepository;

    constructor() {
        this.escenarioRepository = new EscenarioRepository();
    }

    async obtenerTodos() {
        return await this.escenarioRepository.findAll();
    }

    async obtenerPorId(id: number) {
        const escenario = await this.escenarioRepository.findById(id);

        if (!escenario) {
            const error: any = new Error('Escenario no encontrado.');
            error.status = 404;
            throw error;
        }

        return escenario;
    }

    async crearEscenario(data: CreateEscenarioDTO) {

        // Validacion de capacidad (debe ser un numero positivo)
        if (data.capacidad <= 0) {
            const error: any = new Error('La capacidad del escenario debe ser un número positivo.');
            error.status = 400;
            throw error;
        }

        // Falta hacer validacion de existencia del festival (id_festival)

        return await this.escenarioRepository.create(data);
    }

    async actualizarEscenario(id: number, data: UpdateEscenarioDTO) {

        // Validacion de capacidad (debe ser un numero positivo)
        if (data.capacidad !== undefined && data.capacidad <= 0) {
            const error: any = new Error('La capacidad del escenario debe ser un número positivo.');
            error.status = 400;
            throw error;
        }

        // Falta hacer validacion de existencia del festival (id_festival)

        const actualizada = await this.escenarioRepository.update(id, data);

        // Validacion de existencia del escenario antes de actualizarlo
        if (!actualizada) {
            const error: any = new Error('Escenario no encontrado.');
            error.status = 404;
            throw error;
        }

        return actualizada;
    }

    async eliminarEscenario(id: number) {
        // Validacion de existencia del escenario antes de eliminarlo
        const eliminada = await this.escenarioRepository.delete(id);
        if (!eliminada) {
            const error: any = new Error('Escenario no encontrado.');
            error.status = 404;
            throw error;
        }

        return {message: 'Escenario eliminado correctamente.'};
    }
}