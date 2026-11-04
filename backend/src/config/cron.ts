import cron from 'node-cron';
import { pool } from './db.js'; // Ajusta la ruta a tu pool de base de datos

export const initCronJobs = () => {
    // Se ejecuta todos los días a las 23:59
    cron.schedule('59 23 * * *', async () => {
        try {
            console.log('[CRON] Iniciando actualización de la vista materializada de ventas...');
            await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ventas_ocupacion_festival;');
            console.log('[CRON] Vista materializada refrescada con éxito.');
        } catch (error) {
            console.error('[CRON] Error al refrescar la vista materializada:', error);
        }
    });
};