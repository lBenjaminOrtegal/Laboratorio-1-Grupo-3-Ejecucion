import httpClient from './api';
import type { CreateTipoEntradaDTO, UpdateTipoEntradaDTO } from '@/interfaces/tipo_entrada.interface';

const getAll = () => {
  return httpClient.get('/api/tipos-entrada');
};

const getById = (id: number) => {
  return httpClient.get(`/api/tipos-entrada/${id}`);
};

const create = (data: CreateTipoEntradaDTO) => {
  return httpClient.post('/api/tipos-entrada', data);
};

const update = (id: number, data: UpdateTipoEntradaDTO) => {
  return httpClient.put(`/api/tipos-entrada/${id}`, data);
};

const deleteById = (id: number) => {
  return httpClient.delete(`/api/tipos-entrada/${id}`);
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};