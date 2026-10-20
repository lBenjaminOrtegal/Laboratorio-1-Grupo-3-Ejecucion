import { TicketRepository } from '../repositories/ticket.repository.js';
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
            const error: any = new Error('Ticket no encontrado.');
            error.status = 404;
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