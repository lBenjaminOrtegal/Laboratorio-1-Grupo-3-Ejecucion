import httpClient from './api.ts';

const getAll = () => {
    return httpClient.get('/api/auditorias'); // Ajusta a '/api/auditoria' según cómo lo registraste en app.ts
};

const getById = (id: number) => {
    return httpClient.get(`/api/auditorias/${id}`);
};

export default {
    getAll,
    getById,
};