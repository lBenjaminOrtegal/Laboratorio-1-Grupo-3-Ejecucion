import httpClient from './api';

export interface Artista {
  id: number;
  nombre: string;
  genero: string;
  pais: string;
}

const artistaService = {
  getAll: async () => {
    const response = await httpClient.get('/api/artistas');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await httpClient.get(`/api/artistas/${id}`);
    return response.data;
  },

  create: async (data: { nombre: string; genero: string; pais: string }) => {
    const response = await httpClient.post('/api/artistas', data);
    return response.data;
  },

  update: async (id: number, data: Partial<{ nombre: string; genero: string; pais: string }>) => {
    const response = await httpClient.put(`/api/artistas/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await httpClient.delete(`/api/artistas/${id}`);
    return response.data;
  },
};

export default artistaService;
