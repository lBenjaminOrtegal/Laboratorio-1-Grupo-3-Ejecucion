import {useEffect, useState} from "react";
import presentacionService from "../services/presentacion.service.ts";
import type {Presentacion, PresentacionesEscenario} from "../interfaces/presentacion.interface.ts";
import PresentacionCard from "../components/PresentacionCard.tsx";

function LineUp() {

    const [loading, setLoading] = useState(true);
    const [festivales, setFestivales] = useState([]);
    const [lineUp, setLineUp] = useState<PresentacionesEscenario[]>([]);

    // const getFestivals = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await festivalService.getAll();
    //         const responseData = response.data;
    //         setFestivales(responseData);
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const getLineUp = async (id_festival: number, fecha: string) => {
        try {
            setLoading(true);
            const response = await presentacionService.getLineUp(id_festival, fecha);
            const responseData = response.data;
            setLineUp(responseData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getLineUp(1, "2026-11-14");
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-4">
                <h1>Cargando...</h1>
                {/*<Spinner/>*/}
            </div>
        );
    }

    return (
        <div>
            <h1>Line Up para el 14 de Noviembre</h1>

            {lineUp.length === 0 ? (
                <p>No hay presentaciones programadas para esta fecha.</p>
            ) : (
                <div>
                    {lineUp.map((presentacionesEscenario: PresentacionesEscenario) => (
                        <section key={presentacionesEscenario.id_escenario}>
                            <h2>{presentacionesEscenario.nombre_escenario}</h2>
                            <div>
                                {presentacionesEscenario.presentaciones.map((presentacion: Presentacion) => (
                                    <PresentacionCard
                                        id_presentacion={presentacion.id_presentacion}
                                        fecha_inicio={presentacion.fecha_inicio}
                                        fecha_fin={presentacion.fecha_fin}
                                        estado={presentacion.estado}
                                        id_artista={presentacion.id_artista}
                                        nombre_artista={presentacion.nombre_artista}
                                        genero_artista={presentacion.genero_artista}
                                        id_escenario={presentacion.id_escenario}
                                        nombre_escenario={presentacion.nombre_escenario}
                                        id_festival={presentacion.id_festival}
                                        nombre_festival={presentacion.nombre_festival}>
                                    </PresentacionCard>
                                    ))}
                            </div>
                            <br/>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LineUp;