-- =========================================================================
-- SCRIPT DE DATOS DE PRUEBA
-- =========================================================================

TRUNCATE TABLE 
    notificacion,
    auditoria,
    ticket,
    orden_compra,
    tipo_entrada,
    presentacion,
    escenario,
    festival,
    artista,
    recinto,
    usuario
RESTART IDENTITY CASCADE;

-- -------------------------------------------------------------------------
-- 1. USUARIOS
-- -------------------------------------------------------------------------
INSERT INTO usuario (nombre, apellido, correo, contrasena, credito_acumulado, rol) VALUES
('Carlos', 'Mendoza', 'carlos.productor@festivales.cl', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5G2K1b9x.N5h0W2yY1Z8K6aG', 0.00, 'PRODUCTOR'),
('Javiera', 'Soto', 'javiera.productora@festivales.cl', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5G2K1b9x.N5h0W2yY1Z8K6aG', 0.00, 'PRODUCTOR'),
('Matias', 'Rojas', 'matias.rojas@correo.cl', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5G2K1b9x.N5h0W2yY1Z8K6aG', 15000.00, 'ASISTENTE'),
('Valentina', 'Diaz', 'valentina.diaz@correo.cl', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5G2K1b9x.N5h0W2yY1Z8K6aG', 0.00, 'ASISTENTE'),
('Diego', 'Fuentes', 'diego.fuentes@correo.cl', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5G2K1b9x.N5h0W2yY1Z8K6aG', 15000.00, 'ASISTENTE'),
('Camila', 'Silva', 'camila.silva@correo.cl', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8D0R6V5G2K1b9x.N5h0W2yY1Z8K6aG', 0.00, 'ASISTENTE');

-- -------------------------------------------------------------------------
-- 2. RECINTOS
-- -------------------------------------------------------------------------
INSERT INTO recinto (nombre, ciudad, direccion, capacidad) VALUES
('Parque Bicentenario Cerrillos', 'Santiago', 'Av. Pedro Aguirre Cerda 6100, Cerrillos', 80000),
('Parque O''Higgins', 'Santiago', 'Av. Beauchef 398, Santiago Centro', 65000),
('Estadio Ester Roa Rebolledo', 'Concepcion', 'Av. Ignacio Collao 481, Concepcion', 35000);

-- -------------------------------------------------------------------------
-- 3. ARTISTAS
-- -------------------------------------------------------------------------
INSERT INTO artista (nombre, genero, pais) VALUES
('Los Bunkers', 'Rock Alternativo', 'Chile'),
('Mon Laferte', 'Pop / Indie', 'Chile'),
('Arctic Monkeys', 'Indie Rock', 'Reino Unido'),
('The Strokes', 'Garage Rock', 'Estados Unidos'),
('Rufus Du Sol', 'Electronica', 'Australia'),
('Ana Tijoux', 'Hip Hop', 'Chile'),
('Justice', 'Electronica / French House', 'Francia'),
('Los Tres', 'Rock Chileno', 'Chile');

-- -------------------------------------------------------------------------
-- 4. FESTIVALES
-- -------------------------------------------------------------------------
INSERT INTO festival (nombre, fecha_inicio, fecha_fin, estado, id_recinto, id_productor) VALUES
('Santiago Sound Fest 2026', '2026-11-14', '2026-11-15', 'ACTIVO', 1, 1),
('Sur Rock Festival 2026', '2026-12-05', '2026-12-06', 'ACTIVO', 3, 2);

-- -------------------------------------------------------------------------
-- 5. ESCENARIOS
-- -------------------------------------------------------------------------
INSERT INTO escenario (nombre, capacidad, id_festival) VALUES
('Escenario Cordillera (Principal)', 45000, 1),
('Escenario Pacifico', 25000, 1),
('Perry''s Stage (Electronica)', 10000, 1),
('Escenario Bio-Bio', 25000, 2),
('Escenario Araucania', 10000, 2);

-- -------------------------------------------------------------------------
-- 6. PRESENTACIONES
-- -------------------------------------------------------------------------
INSERT INTO presentacion (fecha_inicio, fecha_fin, estado, id_artista, id_escenario) VALUES
-- Festival 1 - Día 1 (2026-11-14)
('2026-11-14 16:00:00', '2026-11-14 17:30:00', 'PROGRAMADA', 6, 1), -- Ana Tijoux en Esc. Cordillera
('2026-11-14 18:00:00', '2026-11-14 19:30:00', 'PROGRAMADA', 2, 1), -- Mon Laferte en Esc. Cordillera
('2026-11-14 20:00:00', '2026-11-14 22:00:00', 'PROGRAMADA', 3, 1), -- Arctic Monkeys en Esc. Cordillera
('2026-11-14 17:30:00', '2026-11-14 19:00:00', 'PROGRAMADA', 1, 2), -- Los Bunkers en Esc. Pacífico
('2026-11-14 19:30:00', '2026-11-14 21:00:00', 'CANCELADA',  5, 3), -- Rufus Du Sol (Cancelada de ejemplo)

-- Festival 1 - Día 2 (2026-11-15)
('2026-11-15 18:00:00', '2026-11-15 19:30:00', 'PROGRAMADA', 8, 1), -- Los Tres en Esc. Cordillera
('2026-11-15 20:00:00', '2026-11-15 22:00:00', 'PROGRAMADA', 4, 1), -- The Strokes en Esc. Cordillera
('2026-11-15 19:00:00', '2026-11-15 20:30:00', 'PROGRAMADA', 7, 3), -- Justice en Perry's Stage

-- Festival 2 - Día 1 (2026-12-05)
('2026-12-05 18:00:00', '2026-12-05 19:30:00', 'PROGRAMADA', 8, 4), -- Los Tres en Esc. Bío-Bío
('2026-12-05 20:00:00', '2026-12-05 22:00:00', 'PROGRAMADA', 1, 4); -- Los Bunkers en Esc. Bío-Bío

-- -------------------------------------------------------------------------
-- 7. TIPOS DE ENTRADA
-- -------------------------------------------------------------------------
INSERT INTO tipo_entrada (nombre, descripcion, precio, stock_inicial, stock_disponible, fecha_acceso, id_festival) VALUES
('Pase General Día 1', 'Acceso general a todos los escenarios el sábado 14 de noviembre', 65000.00, 100, 97, '2026-11-14', 1),
('Pase VIP Día 1', 'Acceso a zona Lounge VIP y barra libre el sábado 14 de noviembre', 130000.00, 50, 48, '2026-11-14', 1),
('Pase General Día 2', 'Acceso general a todos los escenarios el domingo 15 de noviembre', 65000.00, 100, 98, '2026-11-15', 1),
('Entrada General Sur Rock', 'Acceso general al Estadio Ester Roa el sábado 5 de diciembre', 45000.00, 80, 79, '2026-12-05', 2);

-- -------------------------------------------------------------------------
-- 8. ÓRDENES DE COMPRA (DATOS DE PRUEBA)
-- -------------------------------------------------------------------------
INSERT INTO orden_compra (fecha_compra, monto, metodo_pago, estado, id_asistente) VALUES
-- Órdenes exitosas estándar (PAGADO)
('2026-10-10 14:20:00', 130000.00, 'TARJETA_CREDITO', 'PAGADO',      3), -- 1. Matías: 2 General Día 1
('2026-10-11 10:15:00', 260000.00, 'TARJETA_DEBITO',  'PAGADO',      4), -- 2. Valentina: 2 VIP Día 1
('2026-10-13 09:30:00', 130000.00, 'TARJETA_CREDITO', 'PAGADO',      6), -- 3. Camila: 2 General Día 2
('2026-10-14 21:00:00',  45000.00, 'TARJETA_DEBITO',  'PAGADO',      3), -- 4. Matías: 1 Sur Rock
('2026-10-15 08:30:00',  65000.00, 'TRANSFERENCIA',   'PENDIENTE',   5), -- 5. Diego: Esperando comprobante
('2026-10-16 12:10:00', 130000.00, 'TARJETA_CREDITO', 'FALLIDO',     5), -- 6. Diego: Error en la pasarela de pago
('2026-10-16 16:45:00',  45000.00, 'TARJETA_DEBITO',  'CANCELADO',   6), -- 7. Camila: Carrito abandonado/anulado
('2026-10-17 10:00:00', 260000.00, 'TARJETA_CREDITO', 'REEMBOLSADO', 4); -- 8. Valentina: Reembolso VIP procesado

-- -------------------------------------------------------------------------
-- 9. TICKETS
-- -------------------------------------------------------------------------
INSERT INTO ticket (id, id_orden_compra, estado, codigo_unico, fecha_uso, id_tipo_entrada) VALUES
-- Tickets de la Orden 1 (2 entradas General Día 1 - Festival 1)
(1, 1, 'UTILIZADO', 'TCK-SSF26-D1G-0001', '2026-11-14 15:10:00', 1),
(2, 1, 'VALIDO',    'TCK-SSF26-D1G-0002', NULL,                  1),

-- Tickets de la Orden 2 (2 entradas VIP Día 1 - Festival 1)
(1, 2, 'VALIDO',    'TCK-SSF26-D1V-0001', NULL,                  2),
(2, 2, 'VALIDO',    'TCK-SSF26-D1V-0002', NULL,                  2),

-- Ticket de la Orden 3 (1 entrada General Día 1 - Festival 1)
(1, 3, 'VALIDO',    'TCK-SSF26-D1G-0003', NULL,                  1),

-- Tickets de la Orden 4 (2 entradas General Día 2 - Festival 1)
(1, 4, 'VALIDO',    'TCK-SSF26-D2G-0001', NULL,                  3),
(2, 4, 'VALIDO',    'TCK-SSF26-D2G-0002', NULL,                  3),

-- Ticket de la Orden 5 (1 entrada General - Festival 2)
(1, 5, 'VALIDO',    'TCK-SRF26-D1G-0001', NULL,                  4);

-- -------------------------------------------------------------------------
-- 10. AUDITORÍA
-- -------------------------------------------------------------------------
INSERT INTO auditoria (fecha_modificacion, precio_anterior, precio_nuevo, id_tipo_entrada, id_productor) VALUES
('2026-10-05 12:00:00', 55000.00, 65000.00, 1, 1),
('2026-10-08 16:30:00', 115000.00, 130000.00, 2, 1);

-- -------------------------------------------------------------------------
-- 11. NOTIFICACIONES
-- -------------------------------------------------------------------------
INSERT INTO notificacion (mensaje, fecha_envio, id_usuario) VALUES
('La presentación de Rufus Du Sol del 2026-11-14 ha sido cancelada. Se ha abonado un crédito de compensación de $15.000 a tu cuenta.', '2026-10-15 10:00:00', 3),
('La presentación de Rufus Du Sol del 2026-11-14 ha sido cancelada. Se ha abonado un crédito de compensación de $15.000 a tu cuenta.', '2026-10-15 10:00:00', 5);