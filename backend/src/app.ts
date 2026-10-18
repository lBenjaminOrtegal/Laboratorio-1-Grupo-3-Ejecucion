import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';

import presentacionesRoutes from './routes/presentacion.routes.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/presentaciones', presentacionesRoutes); // CRUD Presentaciones

app.use(errorHandler);

export default app;