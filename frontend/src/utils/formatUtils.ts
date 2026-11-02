export const formatearHora = (fechaIso: Date | string): string => {
    const fecha = new Date(fechaIso);
    return fecha.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    });
};

export const formatearFecha = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

export const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVO':
        return 'bg-green-100 text-green-800';
      case 'FINALIZADO':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

export const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVO':
        return 'Activo';
      case 'FINALIZADO':
        return 'Finalizado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };