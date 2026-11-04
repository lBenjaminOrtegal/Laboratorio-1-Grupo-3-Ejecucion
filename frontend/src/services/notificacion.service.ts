import httpClient from './api';

const notificacionService = {
  // Obtener todas las notificaciones del usuario autenticado
  getMyNotifications: async () => {
    const response = await httpClient.get('/api/notificaciones/propias');
    return response.data;
  },

  // Obtener todas las notificaciones
  getAll: async () => {
    const response = await httpClient.get('/api/notificaciones');
    return response.data;
  },

  // Obtener una notificación específica
  getById: async (id: number) => {
    const response = await httpClient.get(`/api/notificaciones/${id}`);
    return response.data;
  },

  // Crear una notificación (probablemente solo para pruebas/admin)
  create: async (data: any) => {
    const response = await httpClient.post('/api/notificaciones', data);
    return response.data;
  },

  // Actualizar una notificación
  update: async (id: number, data: any) => {
    const response = await httpClient.put(`/api/notificaciones/${id}`, data);
    return response.data;
  },

  // Eliminar una notificación
  delete: async (id: number) => {
    const response = await httpClient.delete(`/api/notificaciones/${id}`);
    return response.data;
  },
};

export default notificacionService;
