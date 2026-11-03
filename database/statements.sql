-- Procedimiento almacenado 1: Comprar entradas: validar el cupo disponible del tipo de entrada,
-- crear la orden, generar un ticket con código único por cada entrada y descontar el aforo
-- en una sola transacción atómica.

CREATE OR REPLACE PROCEDURE comprar_entradas(
    p_id_asistente INTEGER,
    p_id_tipo_entrada INTEGER,
    p_cantidad INTEGER,
    p_metodo_pago VARCHAR(50)
)

LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario RECORD;
    v_tipo_entrada RECORD;
    v_monto_total NUMERIC(10, 0);
	v_id_orden_generada INTEGER;
    i INTEGER;
BEGIN
    -- Verificar que la cantidad de entradas sea válida
    IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
        RAISE EXCEPTION 'La cantidad de entradas a comprar debe ser mayor a 0.';
    END IF;

    -- Verificar que el usuario exista, esté activo y tenga rol ASISTENTE
    SELECT id, rol, activo
    INTO v_usuario
    FROM usuario
    WHERE id = p_id_asistente;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario con ID % no existe.', p_id_asistente;
    END IF;

    IF NOT v_usuario.activo THEN
        RAISE EXCEPTION 'El usuario con ID % se encuentra inactivo.', p_id_asistente;
    END IF;

    IF v_usuario.rol <> 'ASISTENTE' THEN
        RAISE EXCEPTION 'Solo los usuarios con rol ASISTENTE pueden comprar entradas.';
    END IF;

    -- Verificar que el tipo de entrada exista, que el festival esté ACTIVO y bloquear la fila
    SELECT te.id, te.precio, te.stock_disponible, f.estado AS estado_festival
    INTO v_tipo_entrada
    FROM tipo_entrada te
    JOIN festival f ON te.id_festival = f.id
    WHERE te.id = p_id_tipo_entrada
    FOR UPDATE OF te;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El tipo de entrada con ID % no existe.', p_id_tipo_entrada;
    END IF;

    IF v_tipo_entrada.estado_festival <> 'ACTIVO' THEN
        RAISE EXCEPTION 'No se pueden comprar entradas para un festival que no está ACTIVO.';
    END IF;

    -- Validar el cupo disponible del tipo de entrada
    IF v_tipo_entrada.stock_disponible < p_cantidad THEN
        RAISE EXCEPTION 'No hay suficiente cupo disponible. Solicitado: %, Disponible: %.',
            p_cantidad, v_tipo_entrada.stock_disponible;
    END IF;

    -- Calcular el monto total y crear la orden de compra en estado PAGADO
    v_monto_total := v_tipo_entrada.precio * p_cantidad;

    INSERT INTO orden_compra (fecha_compra, monto, metodo_pago, estado, id_asistente)
    VALUES (CURRENT_TIMESTAMP, v_monto_total, p_metodo_pago, 'PAGADO', p_id_asistente)
	RETURNING id INTO v_id_orden_generada;

    -- Generar un ticket con código único por cada entrada comprada
    FOR i IN 1..p_cantidad LOOP
        INSERT INTO ticket (id, id_orden_compra, estado, codigo_unico, fecha_uso, id_tipo_entrada)
        VALUES (
            i,
            v_id_orden_generada,
            'VALIDO',
            gen_random_uuid()::TEXT,
            NULL,
            p_id_tipo_entrada
        );
    END LOOP;

    -- Descontar el aforo disponible en el tipo de entrada
    UPDATE tipo_entrada
    SET stock_disponible = stock_disponible - p_cantidad
    WHERE id = p_id_tipo_entrada;
END;
$$;

-- Procedimiento almacenado 2: Cancelar una presentación: marcarla como cancelada,
-- generar notificaciones para todos los asistentes con entradas para ese día y asignarles
-- un crédito de compensación.

CREATE OR REPLACE PROCEDURE cancelar_presentacion(
	id_presentacion INTEGER,
	id_productor INTEGER
)

LANGUAGE plpgsql
AS $$
DECLARE
    v_presentacion RECORD;
    v_asistente RECORD;
    v_credito_por_ticket CONSTANT NUMERIC(10, 2) := 15000.00; -- Credito de compensación por ticket
    v_compensacion_total NUMERIC(10, 2);
BEGIN
    -- Verificar si la presentación existe
    SELECT p.estado, p.fecha_inicio::DATE as fecha, e.id_festival, a.nombre as nombre_artista, f.id_productor AS productor_festival
    INTO v_presentacion
    FROM presentacion p
    JOIN escenario e ON p.id_escenario = e.id
    JOIN festival f ON e.id_festival = f.id
    JOIN artista a ON p.id_artista = a.id
    WHERE p.id = id_presentacion
    FOR UPDATE OF p;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La presentación con ID % no existe.', id_presentacion;
    END IF;

    -- Verificar si la presentacion puede cancelarse (solo si esta PROGRAMADA)
    IF v_presentacion.estado <> 'PROGRAMADA' THEN
        RAISE EXCEPTION 'La presentación no puede cancelarse. Para ello, 
        debe estar en estado PROGRAMADA.';
    END IF;

    -- Verificar si el productor tiene permiso para cancelar la presentacion
    IF v_presentacion.productor_festival IS DISTINCT FROM id_productor THEN
    RAISE EXCEPTION
        'El productor no tiene permiso para cancelar esta presentación.';
    END IF;

    -- Verificar quien asiste a la presentación
    FOR v_asistente IN
        SELECT u.id, u.nombre, u.apellido, COUNT(*) as cantidad_tickets
        FROM ticket t
        JOIN tipo_entrada te ON t.id_tipo_entrada = te.id
        JOIN orden_compra oc ON t.id_orden_compra = oc.id
        JOIN usuario u ON oc.id_asistente = u.id
        WHERE te.id_festival = v_presentacion.id_festival
            AND t.estado IN ('VALIDO', 'UTILIZADO')
            AND te.fecha_acceso = v_presentacion.fecha
            AND oc.estado = 'PAGADO'
            AND u.rol = 'ASISTENTE'
        GROUP BY u.id, u.nombre, u.apellido
        ORDER BY u.id
    LOOP
        -- Calcular el credito de compensacion total para el asistente
        v_compensacion_total := v_asistente.cantidad_tickets * v_credito_por_ticket;
    
        -- Actualizar el crédito acumulado del asistente
        UPDATE usuario
        SET credito_acumulado = credito_acumulado + v_compensacion_total
        WHERE id = v_asistente.id;

        -- Enviar notificación al asistente
        INSERT INTO notificacion (mensaje, id_usuario)
        VALUES (
            format(
                'La presentación de %s del %s ha sido cancelada. 
                Se ha abonado un crédito de compensación de %s por %s ticket(s) a tu cuenta.',
                v_presentacion.nombre_artista,
                v_presentacion.fecha,
                v_compensacion_total,
                v_asistente.cantidad_tickets
            ),
            v_asistente.id
        );

    END LOOP;

    -- Cancelar la presentación
    UPDATE presentacion
    SET estado = 'CANCELADA'
    WHERE id = id_presentacion;
END;
$$;