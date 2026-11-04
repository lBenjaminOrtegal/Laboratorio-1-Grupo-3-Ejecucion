# Sistema de Gestión de Festivales de Música (CedoFest)

**Laboratorio 1 - Grupo 3 - Ejecución**

Una plataforma completa para gestionar festivales de música, permitiendo a productores crear festivales y organizar el line-up, y a asistentes comprar entradas, ver sus tickets y acceder a los eventos.

---

## Integrantes

- Felipe Aedo
- Diego Cabrera
- Fabian Herrera
- Matias Lagos
- Benjamin Ortega

---

## Levantar en Docker

### Requisitos Previos
- Docker
- Docker Compose
- Git

### Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd Laboratorio-1-Grupo-3-Ejecucion

# 2. Levantar los contenedores
docker-compose up --build

# 3. Acceder a la aplicación
# Frontend: http://localhost
# Backend API: http://localhost:3000
# Base de datos: localhost:5432
```

**Nota:** La base de datos se inicializa automáticamente con los scripts SQL en la primera ejecución.

---

## Arquitectura del Proyecto

### Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Backend | Express.js + TypeScript + Node.js |
| Base de Datos | PostgreSQL 17 |
| Estilos | Tailwind CSS + shadcn/ui |
| Autenticación | JWT (JSON Web Tokens) |
| Containerización | Docker + Docker Compose |

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Network                           │
├──────────────┬──────────────────┬──────────────────────────┤
│              │                  │                          │
│  Frontend    │    Backend       │     Database             │
│  (React)     │    (Express.js)  │     (PostgreSQL)         │
│              │                  │                          │
│  Port 80     │    Port 3000     │     Port 5432            │
│  (Nginx)     │    (Node.js)     │                          │
│              │                  │                          │
└──────────────┴──────────────────┴──────────────────────────┘
       │                │                     │
       └────────────────┴─────────────────────┘
         Comunicación a través de la red
         app-network (bridge)
```

---

## Estructura de Carpetas

```
Laboratorio-1-Grupo-3-Ejecucion/
│
├── backend/                           # Servidor Express.js
│   ├── src/
│   │   ├── config/                    # Configuraciones
│   │   │   ├── db.ts                 # Conexión a PostgreSQL
│   │   │   └── cron.ts               # Tareas programadas
│   │   │
│   │   ├── controllers/               # Controladores (lógica de endpoints)
│   │   │   ├── auth.controller.ts
│   │   │   ├── presentacion.controller.ts
│   │   │   ├── ticket.controller.ts
│   │   │   ├── festival.controller.ts
│   │   │   ├── usuario.controller.ts
│   │   │   ├── artista.controller.ts
│   │   │   ├── escenario.controller.ts
│   │   │   ├── recinto.controller.ts
│   │   │   ├── tipo_entrada.controller.ts
│   │   │   ├── orden_compra.controller.ts
│   │   │   ├── notificacion.controller.ts
│   │   │   ├── auditoria.controller.ts
│   │   │   └── reporte.controller.ts
│   │   │
│   │   ├── interfaces/                # Interfaces TypeScript
│   │   │   ├── auth.interface.ts
│   │   │   ├── presentacion.interface.ts
│   │   │   ├── ticket.interface.ts
│   │   │   ├── festival.interface.ts
│   │   │   └── [...]
│   │   │
│   │   ├── middlewares/               # Middlewares
│   │   │   ├── auth.middleware.ts    # Validación de JWT
│   │   │   ├── rbac.middleware.ts    # Control de roles
│   │   │   └── error.middleware.ts   # Manejo de errores
│   │   │
│   │   ├── repositories/              # Data access layer
│   │   │   ├── presentacion.repository.ts
│   │   │   ├── ticket.repository.ts
│   │   │   ├── festival.repository.ts
│   │   │   └── [...]
│   │   │
│   │   ├── routes/                    # Definición de rutas
│   │   │   ├── auth.routes.ts
│   │   │   ├── presentacion.routes.ts
│   │   │   ├── ticket.routes.ts
│   │   │   ├── festival.routes.ts
│   │   │   └── [...]
│   │   │
│   │   ├── services/                  # Lógica de negocio
│   │   │   ├── auth.service.ts
│   │   │   ├── presentacion.service.ts
│   │   │   ├── ticket.service.ts
│   │   │   └── [...]
│   │   │
│   │   ├── app.ts                     # Configuración de Express
│   │   └── server.ts                  # Punto de entrada
│   │
│   ├── Dockerfile                     # Configuración de contenedor
│   ├── package.json                   # Dependencias Node.js
│   ├── tsconfig.json                  # Configuración TypeScript
│   └── .env                           # Variables de entorno
│
├── frontend/                          # Cliente React
│   ├── src/
│   │   ├── components/                # Componentes reutilizables
│   │   │   ├── ui/                   # Componentes de UI (shadcn)
│   │   │   ├── NavBarComponent.tsx
│   │   │   ├── PresentacionCard.tsx
│   │   │   └── [...]
│   │   │
│   │   ├── pages/                     # Páginas
│   │   │   ├── ProducerPanel.tsx
│   │   │   ├── ManagePerformances.tsx
│   │   │   ├── CreatePerformance.tsx
│   │   │   ├── CreateFestival.tsx
│   │   │   ├── Festival.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── [...]
│   │   │
│   │   ├── contexts/                  # Context API
│   │   │   └── AuthContext.tsx        # Estado de autenticación
│   │   │
│   │   ├── services/                  # Servicios HTTP
│   │   │   ├── api.ts                # Configuración de axios
│   │   │   ├── auth.service.ts
│   │   │   ├── presentacion.service.ts
│   │   │   ├── ticket.service.ts
│   │   │   ├── festival.service.ts
│   │   │   └── [...]
│   │   │
│   │   ├── interfaces/                # Interfaces TypeScript
│   │   │   ├── auth.interface.ts
│   │   │   ├── presentacion.interface.ts
│   │   │   ├── ticket.interface.ts
│   │   │   └── [...]
│   │   │
│   │   ├── App.tsx                    # Componente principal
│   │   └── main.tsx                   # Punto de entrada
│   │
│   ├── public/                        # Assets estáticos
│   ├── Dockerfile                     # Configuración de contenedor
│   ├── nginx.conf                     # Configuración de Nginx
│   ├── package.json                   # Dependencias Node.js
│   ├── vite.config.ts                 # Configuración de Vite
│   ├── tsconfig.json                  # Configuración TypeScript
│   └── .env                           # Variables de entorno
│
├── database/                          # Scripts SQL
│   ├── createDatabase.sql             # Definición de tablas
│   ├── fillDatabase.sql               # Datos de prueba
│   └── statements.sql                 # Procedimientos almacenados
│
├── docker-compose.yaml                # Orquestación de contenedores
└── README.md                          # Este archivo
```

### Descripción de Carpetas Clave

**Backend:**
- `config/` - Configuración centralizada (BD, ambiente)
- `controllers/` - Lógica de manejo de peticiones HTTP
- `services/` - Lógica de negocio principal
- `repositories/` - Acceso a datos y queries SQL
- `middlewares/` - Validación, autenticación, autorización
- `routes/` - Definición de endpoints
- `interfaces/` - Tipado TypeScript

**Frontend:**
- `components/` - Componentes React reutilizables
- `pages/` - Páginas completas de la aplicación
- `services/` - Integración con API backend
- `contexts/` - Estado compartido (autenticación, usuario)
- `interfaces/` - Tipos compartidos con backend

**Database:**
- Scripts SQL para inicialización automática de BD
- Se ejecutan en orden: createDatabase → fillDatabase → statements

---

## Documentación de API

### Autenticación y Autorización

Todos los endpoints autenticados requieren enviar el token JWT en el header:
```
Authorization: Bearer <token>
```

**Roles:**
- `PRODUCTOR` - Puede crear festivales, presentaciones, ver reportes
- `ASISTENTE` - Puede comprar entradas, ver sus tickets

### Base URL
```
http://localhost:3000/api
```

---

### 1. Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Registrar nuevo usuario | Pública |
| POST | `/auth/login` | Iniciar sesión (retorna JWT) | Pública |
| GET | `/auth/profile` | Obtener perfil del usuario | JWT |

**Ejemplo - Registrar usuario:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "contrasena": "password123"
}
```

**Ejemplo - Iniciar sesión:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "correo": "juan@example.com",
  "contrasena": "password123"
}

# Respuesta:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": { "id": 1, "nombre": "Juan", "rol": "ASISTENTE" }
}
```

---

### 2. Festivales (`/api/festivales`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/festivales` | Listar todos los festivales | Pública |
| GET | `/festivales/:id` | Obtener un festival | Pública |
| POST | `/festivales` | Crear festival | JWT + PRODUCTOR |
| PUT | `/festivales/:id` | Actualizar festival | JWT + PRODUCTOR |
| DELETE | `/festivales/:id` | Eliminar festival | JWT + PRODUCTOR |

---

### 3. Presentaciones (`/api/presentaciones`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/presentaciones` | Listar todas las presentaciones | Pública |
| GET | `/presentaciones/:id` | Obtener presentación por ID | Pública |
| GET | `/presentaciones/grilla` | Obtener lineup de un día (agrupado por escenario) | Pública |
| POST | `/presentaciones` | Crear presentación | JWT + PRODUCTOR |
| PUT | `/presentaciones/:id` | Actualizar presentación | JWT + PRODUCTOR |
| DELETE | `/presentaciones/:id` | Eliminar presentación | JWT + PRODUCTOR |
| POST | `/presentaciones/:id/cancelar` | Cancelar presentación (notifica asistentes) | JWT + PRODUCTOR |

**Ejemplo - Obtener grilla de un festival:**
```bash
GET /api/presentaciones/grilla?id_festival=1&fecha=2026-11-14
```

**Respuesta:**
```json
[
  {
    "id_escenario": 1,
    "nombre_escenario": "Escenario Principal",
    "presentaciones": [
      {
        "id_presentacion": 1,
        "nombre_artista": "The Weeknd",
        "genero_artista": "R&B/Pop",
        "fecha_inicio": "2026-11-14T20:00:00",
        "fecha_fin": "2026-11-14T21:30:00",
        "estado": "PROGRAMADA"
      }
    ]
  }
]
```

---

### 4. Tickets (`/api/tickets`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/tickets` | Listar todos los tickets | JWT + PRODUCTOR |
| GET | `/tickets/mis-tickets` | Obtener tickets del usuario | JWT + ASISTENTE |
| POST | `/tickets/comprar` | Comprar entradas | JWT + ASISTENTE |
| POST | `/tickets/validar` | Validar ticket para acceso | JWT + PRODUCTOR |
| DELETE | `/tickets/:idOrdenCompra/:id` | Eliminar ticket | JWT + PRODUCTOR |

**Ejemplo - Comprar entradas:**
```bash
POST /api/tickets/comprar
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_tipo_entrada": 5,
  "cantidad": 2,
  "metodo_pago": "tarjeta"
}

# Respuesta:
{
  "mensaje": "Compra de entradas realizada con éxito.",
  "data": [
    {
      "id_orden_compra": 10,
      "numero_ticket": 1,
      "codigo_unico": "ABC123XYZ789",
      "estado": "VIGENTE"
    }
  ]
}
```

**Ejemplo - Validar ticket:**
```bash
POST /api/tickets/validar
Authorization: Bearer <token>
Content-Type: application/json

{
  "codigo_ticket": "ABC123XYZ789"
}

# Respuesta:
{
  "mensaje": "Acceso permitido.",
  "data": { "id": 1, "estado": "UTILIZADO" }
}
```

---

### 5. Tipos de Entrada (`/api/tipos-entrada`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/tipos-entrada` | Listar tipos de entrada | Pública |
| GET | `/tipos-entrada/:id` | Obtener tipo de entrada | Pública |
| POST | `/tipos-entrada` | Crear tipo de entrada | JWT + PRODUCTOR |
| PUT | `/tipos-entrada/:id` | Actualizar tipo de entrada | JWT + PRODUCTOR |
| DELETE | `/tipos-entrada/:id` | Eliminar tipo de entrada | JWT + PRODUCTOR |

---

### 6. Órdenes de Compra (`/api/ordenes-compra`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/ordenes-compra` | Listar órdenes | JWT + PRODUCTOR |
| GET | `/ordenes-compra/usuario/mis-ordenes` | Obtener mis órdenes | JWT + ASISTENTE |
| GET | `/ordenes-compra/:id` | Obtener orden por ID | JWT + PRODUCTOR |

---

### 7. Notificaciones (`/api/notificaciones`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/notificaciones/propias` | Obtener mis notificaciones | JWT |
| GET | `/notificaciones` | Listar todas las notificaciones | JWT + PRODUCTOR |
| POST | `/notificaciones` | Crear notificación | JWT + PRODUCTOR |

---

### 8. Reportes (`/api/reportes`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/reportes/ventas-ocupacion` | Reporte de ventas y aforo | JWT + PRODUCTOR |

---

### 9. Health Check (`/api`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/health` | Verificar estado de la API | Pública |

---

## Características Implementadas

### Base de Datos
- ✅ Tablas relacionales con integridad referencial
- ✅ Índices para optimizar búsquedas (códigos de ticket, IDs de festival)
- ✅ Vista materializada para reportes de ventas/ocupación

### Procedimientos Almacenados
- ✅ **Comprar Entradas**: Validación, creación de orden, generación de tickets con códigos únicos, descuento de aforo (transacción atómica)
- ✅ **Cancelar Presentación**: Marca como cancelada, genera notificaciones, asigna crédito de compensación

### Triggers
- ✅ **Validación de solapamiento**: Impide presentaciones simultáneas en el mismo escenario o del mismo artista
- ✅ **Auditoría de precios**: Registra cambios de precio en tabla de auditoría

### Seguridad
- ✅ Autenticación JWT
- ✅ Control de roles (RBAC)
- ✅ Validación de entrada en todos los endpoints
- ✅ Manejo centralizado de errores

### Frontend
- ✅ Interfaz responsiva con Tailwind CSS
- ✅ Context API para estado global
- ✅ Páginas para roles específicos (Productor / Asistente)
- ✅ Formularios validados

---

## Modelo de Datos

El sistema está basado en las siguientes entidades principales:

- **Usuario** - Productores y Asistentes
- **Festival** - Eventos musicales
- **Recinto** - Locaciones físicas
- **Escenario** - Stages dentro de recintos
- **Artista** - Músicos/bandas
- **Presentación** - Ocurrencia de artista en escenario
- **TipoEntrada** - Categorías de tickets
- **OrdenCompra** - Transacción de compra
- **Ticket** - Entrada individual con código único
- **Notificación** - Alertas a usuarios
- **Auditoría** - Historial de cambios

---

## Solución de Problemas

### Base de datos no inicializa
```bash
# Limpiar volúmenes de Docker
docker-compose down -v

# Reconstruir desde cero
docker-compose up --build
```

### Frontend no se conecta a backend
- Verificar que `VITE_BACKEND_SERVER=backend` en docker-compose.yaml
- Verificar que backend esté en ejecución: `docker-compose logs backend`

### Puertos en uso
```bash
# Ver qué aplicaciones usan los puertos
lsof -i :80   # Frontend
lsof -i :3000 # Backend
lsof -i :5432 # Base de datos
```

---

## Variables de Entorno

### Backend (`.env`)
```
PORT=3000
DB_HOST=database
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=3713
DB_NAME=sgfm
JWT_SECRET=keyjwtcedo
```

### Frontend (`.env`)
```
VITE_BACKEND_SERVER=localhost
VITE_BACKEND_PORT=3000
```

---

## Cómo Usar la Aplicación

### Como Productor

Hay que iniciar sesion con:
- productor1@festicedo.cl 1234
- productor2@festicedo.cl 1234

1. Iniciar sesion
2. Crear festivales
3. Crear recintos y escenarios
4. Agregar artistas
5. Programar presentaciones
6. Ver reportes de ventas

### Como Asistente

Se puede registrar o iniciar sesion con:
- asistente1@festicedo.cl 1234
- asistente2@festicedo.cl 1234
- ...

1. Registrarse como Asistente
2. Explorar festivales disponibles
3. Comprar entradas
4. Ver mis tickets

---