import type { CreatePresentacionDTO } from '@/interfaces/presentacion.interface';
import httpClient from './api';

const presentacionService = {
  getAll: async () => {
    const response = await httpClient.get('/api/presentaciones');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await httpClient.get(`/api/presentaciones/${id}`);
    return response.data;
  },

  getLineUp: async (id_festival: number, fecha: string) => {
    const response = await httpClient.get('/api/presentaciones/grilla', {
      params: { id_festival, fecha },
    });
    return response.data;
  },

  create: async (data: CreatePresentacionDTO) => {
    const response = await httpClient.post('/api/presentaciones', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreatePresentacionDTO>) => {
    const response = await httpClient.put(`/api/presentaciones/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await httpClient.delete(`/api/presentaciones/${id}`);
    return response.data;
  },

  cancelar: async (id: number) => {
    const response = await httpClient.post(`/api/presentaciones/${id}/cancelar`);
    return response.data;
  },
};

export default presentacionService;
