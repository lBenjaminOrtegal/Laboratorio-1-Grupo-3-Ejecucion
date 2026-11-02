import type { Presentacion } from "../interfaces/presentacion.interface.ts";
import { formatearHora } from "../utils/formatUtils.ts";

function PresentacionCard(presentacion: Presentacion) {
  return (
    <div className="card shadow-sm h-100" style={{ minWidth: "260px" }}>
      <div className="card-header d-flex flex-row justify-content-between align-items-center gap-2 bg-transparent">
        <h5
          className="card-title mb-0 text-truncate"
          title={presentacion.nombre_artista}
        >
          {presentacion.nombre_artista}
        </h5>
        <span className="badge theme-accent flex-shrink-0">
          {presentacion.genero_artista}
        </span>
      </div>

      <div className="card-body d-flex flex-column justify-content-between">
        <p className="card-subtitle text-body-secondary fw-medium mb-3">
          {presentacion.nombre_festival}
        </p>

        {/* Bloque de horario con ícono de reloj */}
        <div className="d-flex align-items-center gap-2 mt-auto pt-2 border-top">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-clock fg-accent"
            viewBox="0 0 16 16"
          >
            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
          </svg>
          <p className="card-text fw-semibold mb-0 small">
            {formatearHora(presentacion.fecha_inicio)} -{" "}
            {formatearHora(presentacion.fecha_fin)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PresentacionCard;