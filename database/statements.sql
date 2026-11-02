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