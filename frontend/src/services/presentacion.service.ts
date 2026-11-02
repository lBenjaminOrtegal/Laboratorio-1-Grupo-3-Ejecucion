import httpClient from './api.ts';
import type {CreatePresentacionDTO, UpdatePresentacionDTO} from "../interfaces/presentacion.interface.ts";

const getAll = () => {
    return httpClient.get('/api/presentaciones');
}

const getById = (id: number) => {
    return httpClient.get(`/api/presentaciones/${id}`);
}

const getLineUp = (idFestival: number, fecha: string) => {
    return httpClient.get('/api/presentaciones/grilla', {
        params: {
            id_festival: idFestival,
            fecha: fecha
        }
    });
};

const create = (data: CreatePresentacionDTO) => {
    return httpClient.post('/presentaciones', data);
}

const update = (id: number, data: UpdatePresentacionDTO) => {
    return httpClient.put(`/api/presentaciones/${id}`, data);
}

const deleteById = (id: number) => {
    return httpClient.delete(`/api/presentaciones/${id}`);
}

export default {
    getAll,
    getById,
    getLineUp,
    create,
    update,
    deleteById,
};