import { Router } from 'express';
import { ReporteController } from '../controllers/reporte.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/rbac.middleware.js';

const reporteController = new ReporteController();
const reporteRouter = Router();

// Autenticadas y rol = PRODUCTOR
reporteRouter.get('/ventas-ocupacion', authenticateJWT, authorizeRoles("PRODUCTOR"), reporteController.getVentasOcupacion);

export default reporteRouter;