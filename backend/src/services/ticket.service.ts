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
     * @returns Una promesa que resuelve con el objeto del ticket (incluye enriquecimiento).
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
        const codigo = (body as Record<string, unknown>).codigo_unico; 
        if (typeof codigo !== 'string' || !codigo.trim() || codigo.length > 64) {
            const error: any = new Error('codigo_unico debe ser texto no vacío de hasta 64 caracteres.');
            error.status = 400;
            throw error;
        }

        const resultado = await this.ticketRepository.registrarAcceso(codigo);
        
        // Caso de éxito: ACEPTADO (ticket válido y marcado como utilizado)
        if (resultado.resultado === 'ACEPTADO') {
            return resultado.ticket;
        }
        
        // Casos de error: lanzar excepción con datos del ticket si aplica
        const mensajes = {
            UTILIZADO: 'El ticket ya fue utilizado.',
            NO_ENCONTRADO: 'Ticket no encontrado.',
            ANULADO: 'El ticket está anulado.',
        };
        
        const error: any = new Error(mensajes[resultado.resultado]);
        error.status = resultado.resultado === 'NO_ENCONTRADO' ? 404 : 409;
        
        // Adjuntar datos del ticket si existe (para UTILIZADO o ANULADO)
        if (resultado.resultado === 'UTILIZADO' && resultado.ticket) {
            error.ticket = resultado.ticket;
        }
        
        throw error;
    }

    /**
     * Crea un nuevo ticket
     * - Si no se proporciona estado, se asigna 'VALIDO' por defecto en el repositorio
     * - Si estado es 'UTILIZADO' sin fecha_uso, se asigna timestamp actual
     */
    async crearTicket(data: CreateTicketDTO) {
        if (data.estado === 'UTILIZADO' && !data.fecha_uso) {
            data.fecha_uso = new Date().toISOString();
        }
        return await this.ticketRepository.create(data);
    }

    /**
     * Actualiza un ticket existente
     * - Solo se pueden actualizar tickets en estado 'VALIDO' con fecha_uso NULL
     * - Si estado cambia a 'UTILIZADO' sin fecha_uso, se asigna timestamp actual
     */
    async actualizarTicket(idOrdenCompra: number, id: number, data: UpdateTicketDTO) {
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

    /**
     * Obtiene todos los tickets de un usuario específico
     * - Busca mediante orden_compra.id_asistente
     * - Incluye nombre del tipo de entrada
     * 
     * @param idUsuario - ID del usuario autenticado
     * @returns Array de tickets enriquecidos del usuario
     */
    async obtenerTicketsDelUsuario(idUsuario: number) {
        const tickets = await this.ticketRepository.findByUsuario(idUsuario);
        return tickets;
    }
}