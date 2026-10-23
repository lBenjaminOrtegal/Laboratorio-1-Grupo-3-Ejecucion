import type {Presentacion} from "../interfaces/presentacion.interface.ts";
import {formatearHora} from "../utils/formatUtils.ts";

function PresentacionCard(presentacion: Presentacion) {
    return (
        <div key={presentacion.id_presentacion}>
            <div>
                <h3>{presentacion.nombre_artista}</h3>
                <p>
                    {formatearHora(presentacion.fecha_inicio)} - {formatearHora(presentacion.fecha_fin)}
                </p>
            </div>
            <p>
                {presentacion.estado}
            </p>
        </div>
    )
}

export default PresentacionCard;