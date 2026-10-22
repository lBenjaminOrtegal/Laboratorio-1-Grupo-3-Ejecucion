import {PresentacionRepository} from '../repositories/presentacion.repository.js';
import {CreatePresentacionDTO, UpdatePresentacionDTO,} from '../interfaces/presentacion.interface.js'

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

        // Agrupar las filas por escenario
        return Object.values(
            presentaciones.reduce((acc: Record<number, any>, fila: any) => {
                const idEscenario = fila.id_escenario;

                // Si el escenario no existe lo inicializamos
                if (!acc[idEscenario]) {
                    acc[idEscenario] = {
                        id_escenario: idEscenario,
                        nombre_escenario: fila.nombre_escenario,
                        presentaciones: []
                    };
                }

                // Agregamos la presentacion a la lista de ese escenario
                acc[idEscenario].presentaciones.push({
                    id_presentacion: fila.id_presentacion,
                    id_artista: fila.id_artista,
                    nombre_artista: fila.nombre_artista,
                    genero: fila.genero,
                    fecha_inicio: fila.fecha_inicio,
                    fecha_fin: fila.fecha_fin,
                    estado: fila.estado
                });

                return acc;
            }, {})
        );
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