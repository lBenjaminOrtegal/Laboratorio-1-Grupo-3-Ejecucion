import httpClient from './api';
import type { OrdenCompra } from '@/interfaces/orden_compra.interface';

/**
 * Obtiene todas las órdenes de compra del usuario autenticado
 * Endpoint protegido para ASISTENTE
 */
const getMyOrders = () => {
  return httpClient.get<OrdenCompra[]>('/api/ordenes-compra/usuario/mis-ordenes');
};

/**
 * Obtiene una orden de compra específica por ID
 */
const getOrderById = (id: number) => {
  return httpClient.get<OrdenCompra>(`/api/ordenes-compra/${id}`);
};

/**
 * Obtiene todas las órdenes de compra (requiere rol PRODUCTOR)
 */
const getAllOrders = () => {
  return httpClient.get<OrdenCompra[]>('/api/ordenes-compra');
};

export default {
  getMyOrders,
  getOrderById,
  getAllOrders,
};
