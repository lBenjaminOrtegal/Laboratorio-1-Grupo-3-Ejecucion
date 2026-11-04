import axios from "axios";

const backendServer = import.meta.env.VITE_BACKEND_SERVER || "localhost";
const backendPort = import.meta.env.VITE_BACKEND_PORT || "3000";

const baseURL = `http://${backendServer}:${backendPort}`;

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;