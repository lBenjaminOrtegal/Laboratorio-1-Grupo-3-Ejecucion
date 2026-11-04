import httpClient from './api.ts';

const getVentasOcupacion = () => {
    return httpClient.get('/api/reportes/ventas-ocupacion');
}

export default {
    getVentasOcupacion,
};