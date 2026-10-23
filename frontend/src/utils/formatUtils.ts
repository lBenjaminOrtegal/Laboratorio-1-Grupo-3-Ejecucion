export const formatearHora = (fechaIso: Date | string): string => {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    });
};