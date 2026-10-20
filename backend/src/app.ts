import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';

import presentacionesRoutes from './routes/presentacion.routes.js';
import tiposEntradaRoutes from './routes/tipo_entrada.routes.js';
import escenarioRoutes from './routes/escenario.routes.js';
import ordenCompraRoutes from './routes/orden_compra.routes.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/presentaciones', presentacionesRoutes); // CRUD Presentaciones
app.use('/api/tipos-entrada', tiposEntradaRoutes); // CRUD Tipos de entrada
app.use('/api/escenarios', escenarioRoutes); // CRUD Escenarios
app.use('/api/ordenes-compra', ordenCompraRoutes); // CRUD Ordenes de compra

app.use(errorHandler);

export default app;