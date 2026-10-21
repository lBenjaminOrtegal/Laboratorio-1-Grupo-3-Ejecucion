-- 1. Tabla Usuario
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    credito_acumulado NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (credito_acumulado >= 0),
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('PRODUCTOR', 'ASISTENTE')),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Tabla Recinto
CREATE TABLE recinto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    capacidad INT NOT NULL CHECK (capacidad > 0)
);

-- 3. Tabla Artista
CREATE TABLE artista (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) UNIQUE NOT NULL,
    genero VARCHAR(80) NOT NULL,
    pais VARCHAR(80) NOT NULL
);

-- 4. Tabla Festival
CREATE TABLE festival (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL CHECK (fecha_fin >= fecha_inicio),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'FINALIZADO', 'CANCELADO')),
    id_recinto INT NOT NULL REFERENCES recinto(id) ON DELETE RESTRICT,
    id_productor INT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT
);

-- 5. Tabla Escenario
CREATE TABLE escenario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL CHECK (capacidad > 0),
    id_festival INT NOT NULL REFERENCES festival(id) ON DELETE CASCADE
);

-- 6. Tabla Presentación
CREATE TABLE presentacion (
    id SERIAL PRIMARY KEY,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL CHECK (fecha_fin > fecha_inicio),
    estado VARCHAR(20) NOT NULL DEFAULT 'PROGRAMADA' CHECK (estado IN ('PROGRAMADA', 'CANCELADA', 'FINALIZADA')),
    id_artista INT NOT NULL REFERENCES artista(id) ON DELETE RESTRICT,
    id_escenario INT NOT NULL REFERENCES escenario(id) ON DELETE CASCADE
);

-- 7. Tabla Tipo de Entrada
CREATE TABLE tipo_entrada (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    stock_inicial INT NOT NULL CHECK (stock_inicial > 0),
    stock_disponible INT NOT NULL CHECK (stock_disponible >= 0 AND stock_disponible <= stock_inicial),
    fecha_acceso DATE NOT NULL,
    id_festival INT NOT NULL REFERENCES festival(id) ON DELETE CASCADE
);

-- 8. Tabla Orden de Compra
CREATE TABLE orden_compra (
    id SERIAL PRIMARY KEY,
    fecha_compra TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto NUMERIC(10, 2) NOT NULL CHECK (monto >= 0),
    metodo_pago VARCHAR(50) NOT NULL CHECK (metodo_pago IN ('TARJETA_CREDITO', 'TARJETA_DEBITO')),
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PAGADO', 'CANCELADO', 'FALLIDO', 'REEMBOLSADO')),
    id_asistente INT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT
);

-- 9. Tabla Ticket
CREATE TABLE ticket (
    id INT NOT NULL,
    id_orden_compra INT NOT NULL REFERENCES orden_compra(id) ON DELETE CASCADE,
    estado VARCHAR(20) NOT NULL DEFAULT 'VALIDO' CHECK (estado IN ('VALIDO', 'UTILIZADO', 'ANULADO')),
    codigo_unico VARCHAR(64) UNIQUE NOT NULL,
    fecha_uso TIMESTAMP NULL,
    id_tipo_entrada INT NOT NULL REFERENCES tipo_entrada(id) ON DELETE RESTRICT,
    PRIMARY KEY (id, id_orden_compra)
);

-- 10. Tabla Auditoría
CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    fecha_modificacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    precio_anterior NUMERIC(10, 2) NOT NULL,
    precio_nuevo NUMERIC(10, 2) NOT NULL,
    id_tipo_entrada INT NOT NULL REFERENCES tipo_entrada(id) ON DELETE CASCADE,
    id_productor INT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT
);

-- 11. Tabla Notificación
CREATE TABLE notificacion (
    id SERIAL PRIMARY KEY,
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
);