import axios from "axios";

const backendServer = import.meta.env.VITE_BACKEND_SERVER;
const backendPort = import.meta.env.VITE_BACKEND_PORT;

const api = axios.create({
    baseURL: `http://${backendServer}:${backendPort}`,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;