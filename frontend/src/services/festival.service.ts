import httpClient from './api';

const getAll = () => {
  return httpClient.get('/api/festivales');
};

const getById = (id: number) => {
  return httpClient.get(`/api/festivales/${id}`);
};

const create = (data: any) => {
  return httpClient.post('/api/festivales', data);
};

const update = (id: number, data: any) => {
  return httpClient.put(`/api/festivales/${id}`, data);
};

const deleteById = (id: number) => {
  return httpClient.delete(`/api/festivales/${id}`);
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
