import {TicketRepository} from '../repositories/ticket.repository.js';
import {
    CreateTicketDTO,
    UpdateTicketDTO,
} from '../interfaces/ticket.interface.js';

export class TicketService {
    private ticketRepository: TicketRepository;

    constructor() {
        this.ticketRepository = new TicketRepository();
    }

    async obtenerTodos() {
        return await this.ticketRepository.findAll();
    }

    async obtenerPorId(idOrdenCompra: number, id: number) {
        const ticket = await this.ticketRepository.findById(idOrdenCompra, id);
        if (!ticket) {
            const error: any = new Error('Ticket no encontrado.');
            error.status = 404;
            throw error;
        }
        return ticket;
    }

    /**
     * Valida el formato de la petición y procesa el registro de acceso de un ticket.
     * 
     * @description
     * 1. Validación estructural: Verifica que el `body` sea un objeto JSON válido y que contenga
     *    la propiedad `codigo_unico` como un string no vacío (máx. 64 caracteres).
     * 2. Validación de negocio: Delega al repositorio la verificación del estado del ticket en la base de datos.
     *
     * @param body - El cuerpo de la petición HTTP con tipo inicial `unknown`.
     * 
     * @returns Una promesa que resuelve con el objeto del ticket si el acceso es 'ACEPTADO'.
     * 
     * @throws `Error(400)` - Bad Request: si el formato del JSON o el código son inválidos.
     * @throws `Error(404)` - Not Found: si el ticket no existe en el sistema.
     * @throws `Error(409)` - Conflict: si el ticket ya fue utilizado o está anulado.
     *
     */
    async validarAcceso(body: unknown) {
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            const error: any = new Error('Debe enviar un objeto JSON con codigo_unico.');
            error.status = 400; 
            throw error;
        }
        // 'Record<string, unknown>' es un tipo utilitario que define la estructura de un objeto con claves string y valores unknown
        const codigo = (body as Record<string, unknown>).codigo_unico; 
        if (typeof codigo !== 'string' || !codigo.trim() || codigo.length > 64) {
            const error: any = new Error('codigo_unico debe ser texto no vacío de hasta 64 caracteres.');
            error.status = 400;
            throw error;
        }

        const resultado = await this.ticketRepository.registrarAcceso(codigo); // retorna ResultadoAccesoTicket que tiene campos 'resultado' y 'ticket'
        // Si el estado es exitoso, se retorna el objeto del ticket válido
        if (resultado.resultado === 'ACEPTADO') return resultado.ticket;
        // si el estado es NO_ENCONTRADO, UTILIZADO o ANULADO, se lanza un error con el mensaje y código de estado correspondiente
        const mensajes = {
            NO_ENCONTRADO: 'Ticket no encontrado.',
            UTILIZADO: 'El ticket ya fue utilizado.',
            ANULADO: 'El ticket está anulado.',
        };
        const error: any = new Error(mensajes[resultado.resultado]);
        error.status = resultado.resultado === 'NO_ENCONTRADO' ? 404 : 409;
        throw error;
    }


    async crearTicket(data: CreateTicketDTO) {
        // Si se crea directamente con estado 'UTILIZADO' y no viene fecha_uso, se asigna la fecha actual
        if (data.estado === 'UTILIZADO' && !data.fecha_uso) {
            data.fecha_uso = new Date().toISOString();
        }
        return await this.ticketRepository.create(data);
    }

    async actualizarTicket(idOrdenCompra: number, id: number, data: UpdateTicketDTO) {
        // Si cambia a UTILIZADO y no se especificó fecha_uso, se registra el momento actual
        if (data.estado === 'UTILIZADO' && data.fecha_uso === undefined) {
            data.fecha_uso = new Date().toISOString();
        }

        const actualizado = await this.ticketRepository.update(idOrdenCompra, id, data);
        if (!actualizado) {
            const existente = await this.ticketRepository.findById(idOrdenCompra, id);
            const error: any = new Error(existente
                ? 'No se puede modificar un ticket utilizado o anulado.'
                : 'Ticket no encontrado.');
            error.status = existente ? 409 : 404;
            throw error;
        }
        return actualizado;
    }

    async eliminarTicket(idOrdenCompra: number, id: number) {
        const eliminado = await this.ticketRepository.delete(idOrdenCompra, id);
        if (!eliminado) {
            const error: any = new Error('Ticket no encontrado.');
            error.status = 404;
            throw error;
        }
        return eliminado;
    }
}