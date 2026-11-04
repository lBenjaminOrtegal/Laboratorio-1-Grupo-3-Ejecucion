import httpClient from './api';

export interface Escenario {
  id: number;
  nombre: string;
  capacidad: number;
  id_festival: number;
}

const escenarioService = {
  getAll: async () => {
    const response = await httpClient.get('/api/escenarios');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await httpClient.get(`/api/escenarios/${id}`);
    return response.data;
  },

  create: async (data: { nombre: string; capacidad: number; id_festival: number }) => {
    const response = await httpClient.post('/api/escenarios', data);
    return response.data;
  },

  update: async (id: number, data: Partial<{ nombre: string; capacidad: number }>) => {
    const response = await httpClient.put(`/api/escenarios/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await httpClient.delete(`/api/escenarios/${id}`);
    return response.data;
  },
};

export default escenarioService;
