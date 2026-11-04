import app from './app.js';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import { initCronJobs } from './config/cron.js';

dotenv.config();

const PORT = process.env.PORT || 3000; // Respaldo por si falla el .env

async function startServer() {
    try {
        await pool.query('SELECT 1');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
            // Inicializar cron jobs SOLO si la BD y el servidor arrancaron bien
            initCronJobs();
            console.log('Cron jobs inicializados correctamente.');
        });
    } catch (error) {
        console.error('Error conectando a PostgreSQL:', error);
        process.exit(1);
    }
}

startServer();