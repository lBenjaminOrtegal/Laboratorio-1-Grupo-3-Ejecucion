import httpClient from './api';
import type { Ticket, CreateTicketDTO, UpdateTicketDTO, TicketEnriquecido, BuyTicketsDTO } from '@/interfaces/ticket.interface';

/**
 * Valida un ticket mediante su código único
 * Marca automáticamente como UTILIZADO si es válido
 * @param codigo_unico - Código único del ticket (máx 64 caracteres)
 * @returns Response con estructura {mensaje, data: Ticket enriquecido}
 */
const validateTicket = (codigo_unico: string) => {
  return httpClient.post<{ mensaje: string; data: Ticket & { tipo_entrada_nombre?: string } }>('/api/tickets/validar', { codigo_unico });
};

/**
 * Obtiene los tickets del usuario actual
 * Endpoint protegido para ASISTENTE - retorna tickets enriquecidos con nombre de tipo de entrada
 */
const getTicketsByUser = () => {
  return httpClient.get<TicketEnriquecido[]>('/api/tickets/mis-tickets');
};

/**
 * Obtiene un ticket específico por su clave compuesta
 * @param idOrdenCompra - ID de la orden de compra
 * @param id - ID del ticket dentro de la orden
 */
const getTicketById = (idOrdenCompra: number, id: number) => {
  return httpClient.get<Ticket>(`/api/tickets/${idOrdenCompra}/${id}`);
};

/**
 * Obtiene todos los tickets del sistema (requiere rol PRODUCTOR)
 */
const getAllTickets = () => {
  return httpClient.get<Ticket[]>('/api/tickets');
};

/**
 * Crea un nuevo ticket
 * @param data - DTO con datos del ticket
 */
const createTicket = (data: CreateTicketDTO) => {
  return httpClient.post<Ticket>('/api/tickets', data);
};

/**
 * Actualiza un ticket existente
 * @param idOrdenCompra - ID de la orden de compra
 * @param id - ID del ticket
 * @param data - DTO con los campos a actualizar
 */
const updateTicket = (idOrdenCompra: number, id: number, data: UpdateTicketDTO) => {
  return httpClient.put<Ticket>(`/api/tickets/${idOrdenCompra}/${id}`, data);
};

/**
 * Elimina un ticket
 * @param idOrdenCompra - ID de la orden de compra
 * @param id - ID del ticket
 */
const deleteTicket = (idOrdenCompra: number, id: number) => {
  return httpClient.delete<Ticket>(`/api/tickets/${idOrdenCompra}/${id}`);
};

/**
 * Compra entradas ejecutando el procedimiento almacenado
 * Requiere rol ASISTENTE (el id_asistente se toma del token JWT)
 */
const buyTickets = (data: BuyTicketsDTO) => {
  return httpClient.post<{ mensaje: string; data: TicketEnriquecido[] }>('/api/tickets/comprar', data);
};

export default {
  validateTicket,
  getTicketsByUser,
  getTicketById,
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  buyTickets,
};


