import express, {Application, Request, Response} from "express";
import cors from "cors";
import {errorHandler} from "./middlewares/error.middleware.js";

import presentacionesRoutes from "./routes/presentacion.routes.js";
import tiposEntradaRoutes from "./routes/tipo_entrada.routes.js";
import escenarioRoutes from "./routes/escenario.routes.js";
import ordenCompraRoutes from "./routes/orden_compra.routes.js";
import usuariosRoutes from "./routes/usuario.routes.js";
import notificacionesRoutes from "./routes/notificacion.routes.js";
import festivalRoutes from "./routes/festival.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import artistaRoutes from "./routes/artista.routes.js";
import recintoRoutes from "./routes/recinto.routes.js";
import auditoriaRoutes from "./routes/auditoria.routes.js";

import authRoutes from "./routes/auth.routes.js";
import reporteRoutes from "./routes/reporte.routes.js";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({status: "ok", timestamp: new Date().toISOString()});
});

app.use("/api/presentaciones", presentacionesRoutes); // CRUD Presentaciones
app.use("/api/tipos-entrada", tiposEntradaRoutes); // CRUD Tipos de entrada
app.use("/api/escenarios", escenarioRoutes); // CRUD Escenarios
app.use("/api/ordenes-compra", ordenCompraRoutes); // CRUD Ordenes de compra
app.use("/api/festivales", festivalRoutes); // CRUD Festivales
app.use("/api/tickets", ticketRoutes); // CRUD Tickets
app.use("/api/artistas", artistaRoutes); // CRUD Artistas
app.use("/api/recintos", recintoRoutes); // CRUD Recintos
app.use("/api/auditorias", auditoriaRoutes); // CRUD Auditorias
app.use("/api/usuarios", usuariosRoutes); // CRUD Usuarios
app.use("/api/notificaciones", notificacionesRoutes); // CRUD Notificaciones
app.use("/api/reportes", reporteRoutes) // Endpoints de reportes
app.use("/api/auth", authRoutes); // Endpoints de autenticacion

app.use(errorHandler);

export default app;
