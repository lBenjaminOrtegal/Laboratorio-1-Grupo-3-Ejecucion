import httpClient from './api';

const getAll = () => {
  return httpClient.get('/api/tipos-entrada');
};

const getById = (id: number) => {
  return httpClient.get(`/api/tipos-entrada/${id}`);
};

export default {
  getAll,
  getById,
};