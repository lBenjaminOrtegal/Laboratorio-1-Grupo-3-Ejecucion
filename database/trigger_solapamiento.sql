-- Tarea 4: ejecutar DESPUÉS de createDatabase.sql en la base del laboratorio.
-- Es repetible: reemplaza solamente esta función y este trigger.
BEGIN;

CREATE OR REPLACE FUNCTION validar_solapamiento_presentacion()
RETURNS TRIGGER
LANGUAGE plpgsql -- plpgsql permite control de flujo, excepciones y transacciones
AS $$
BEGIN
    -- Serializar las programaciones del mismo artista o escenario. Los bloqueos
    -- duran hasta COMMIT/ROLLBACK; la aplicación utiliza READ COMMITTED.
    PERFORM id FROM artista WHERE id = NEW.id_artista FOR UPDATE;
    PERFORM id FROM escenario WHERE id = NEW.id_escenario FOR UPDATE;

    -- Una presentación cancelada no ocupa horario.
    IF NEW.estado = 'CANCELADA' THEN
        RETURN NEW;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM presentacion p
        WHERE p.id IS DISTINCT FROM NEW.id
          AND p.estado <> 'CANCELADA'
          AND p.id_escenario = NEW.id_escenario
          AND NEW.fecha_inicio < p.fecha_fin
          AND NEW.fecha_fin > p.fecha_inicio
    ) THEN
        RAISE EXCEPTION 'El escenario ya tiene una presentación en ese horario.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM presentacion p
        WHERE p.id IS DISTINCT FROM NEW.id
          AND p.estado <> 'CANCELADA'
          AND p.id_artista = NEW.id_artista
          AND NEW.fecha_inicio < p.fecha_fin
          AND NEW.fecha_fin > p.fecha_inicio
    ) THEN
        RAISE EXCEPTION 'El artista ya tiene una presentación en ese horario.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_solapamiento_presentacion ON presentacion;
CREATE TRIGGER trg_solapamiento_presentacion
BEFORE INSERT OR UPDATE OF fecha_inicio, fecha_fin, id_artista, id_escenario, estado
ON presentacion
FOR EACH ROW
EXECUTE FUNCTION validar_solapamiento_presentacion();

COMMIT;
