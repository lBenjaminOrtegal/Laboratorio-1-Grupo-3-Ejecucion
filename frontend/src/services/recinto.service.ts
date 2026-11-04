import httpClient from './api.ts';
import type {CreateRecintoDTO, UpdateRecintoDTO} from "../interfaces/recinto.interface.ts";

const getAll = () => {
    return httpClient.get('/api/recintos');
}

const getById = (id: number) => {
    return httpClient.get(`/api/recintos/${id}`);
}

const create = (data: CreateRecintoDTO) => {
    return httpClient.post('/api/recintos', data);
}

const update = (id: number, data: UpdateRecintoDTO) => {
    return httpClient.put(`/api/recintos/${id}`, data);
}

const deleteById = (id: number) => {
    return httpClient.delete(`/api/recintos/${id}`);
}

export default {
    getAll,
    getById,
    create,
    update,
    deleteById,
};