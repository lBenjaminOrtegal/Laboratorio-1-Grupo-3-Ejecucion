import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader,
  History,
  TrendingUp,
  TrendingDown,
  User,
  Calendar,
  Ticket as TicketIcon,
  Eye,
  X,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import auditoriaService from '@/services/auditoria.service';
import type { Auditoria } from '@/interfaces/auditoria.interface';
import { formatearFecha, formatearHora } from '@/utils/formatUtils';

function AuditoriaPage() {
  const navigate = useNavigate();

  const [registros, setRegistros] = useState<Auditoria[]>([]);
  const [registroSeleccionado, setRegistroSeleccionado] = useState<Auditoria | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatearPrecioCLP = (precio: number | string) => {
    return Number(precio).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  useEffect(() => {
    const cargarAuditorias = async () => {
      try {
        setLoading(true);
        const response = await auditoriaService.getAll();
        const data: Auditoria[] = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        setRegistros(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar registros de auditoría:', err);
        setError('No se pudo cargar el historial de auditoría de precios.');
      } finally {
        setLoading(false);
      }
    };

    cargarAuditorias();
  }, []);

  // Consume el endpoint GET /api/auditorias/:id
  const verDetalleRegistro = async (id: number) => {
    try {
      setLoadingDetalle(true);
      const response = await auditoriaService.getById(id);
      const data: Auditoria = response.data?.data || response.data;
      setRegistroSeleccionado(data);
    } catch (err) {
      console.error('Error al obtener el detalle del registro:', err);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const registrosFiltrados = registros.filter((reg) => {
    const termino = busqueda.toLowerCase();
    return (
      reg.nombre_tipo_entrada?.toLowerCase().includes(termino) ||
      reg.nombre_festival?.toLowerCase().includes(termino) ||
      reg.nombre_productor?.toLowerCase().includes(termino) ||
      reg.apellido_productor?.toLowerCase().includes(termino) ||
      String(reg.id).includes(termino)
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-muted-foreground">Cargando historial de auditoría...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" className="gap-2 mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full bg-background pb-16">
      {/* Banner / Header */}
      <div className="bg-gradient-to-br from-accent/15 via-accent/10 to-background border-b border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground flex items-center gap-3">
                <History className="w-10 h-10 text-accent" />
                Auditoría de Precios
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Registro histórico inmutable de modificaciones de precios en tipos de entrada (Trigger BD).
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg px-4 py-3 text-sm">
              <span className="text-muted-foreground">Total modificaciones: </span>
              <span className="font-bold text-foreground">{registros.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Barra de búsqueda */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por entrada, festival o productor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Panel de Detalle Individual (Endpoint getById) */}
        {registroSeleccionado && (
          <Card className="border-accent/50 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between border-b border-border pb-4 mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Detalle del Registro #{registroSeleccionado.id}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-1">
                    {registroSeleccionado.nombre_tipo_entrada || `Tipo Entrada ID #${registroSeleccionado.id_tipo_entrada}`}
                  </h3>
                  {registroSeleccionado.nombre_festival && (
                    <p className="text-sm text-muted-foreground">
                      Festival: {registroSeleccionado.nombre_festival}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRegistroSeleccionado(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-xs text-muted-foreground">Precio Anterior</p>
                  <p className="text-lg font-semibold text-muted-foreground line-through mt-1">
                    {formatearPrecioCLP(registroSeleccionado.precio_anterior)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-xs text-muted-foreground">Precio Nuevo</p>
                  <p className="text-lg font-bold text-foreground mt-1">
                    {formatearPrecioCLP(registroSeleccionado.precio_nuevo)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-xs text-muted-foreground">Autor del Cambio</p>
                  <p className="font-semibold text-foreground mt-1">
                    {registroSeleccionado.nombre_productor
                      ? `${registroSeleccionado.nombre_productor} ${registroSeleccionado.apellido_productor}`
                      : `Productor ID #${registroSeleccionado.id_productor}`}
                  </p>
                  {registroSeleccionado.correo_productor && (
                    <p className="text-xs text-muted-foreground">{registroSeleccionado.correo_productor}</p>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-xs text-muted-foreground">Fecha y Hora Exacta</p>
                  <p className="font-semibold text-foreground mt-1">
                    {formatearFecha(registroSeleccionado.fecha_modificacion)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatearHora(registroSeleccionado.fecha_modificacion)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabla de Registros */}
        {registrosFiltrados.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-12 text-center">
              <History className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">
                No se encontraron registros de modificaciones de precios.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Entrada / Festival</th>
                    <th className="px-6 py-4 font-medium text-right">Precio Anterior</th>
                    <th className="px-6 py-4 font-medium text-right">Precio Nuevo</th>
                    <th className="px-6 py-4 font-medium text-center">Variación</th>
                    <th className="px-6 py-4 font-medium">Productor</th>
                    <th className="px-6 py-4 font-medium">Fecha</th>
                    <th className="px-6 py-4 font-medium text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {registrosFiltrados.map((reg) => {
                    const anterior = Number(reg.precio_anterior);
                    const nuevo = Number(reg.precio_nuevo);
                    const diferencia = nuevo - anterior;
                    const esAlza = diferencia > 0;
                    const porcentaje =
                      anterior > 0 ? ((diferencia / anterior) * 100).toFixed(1) : '100';

                    return (
                      <tr key={reg.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                          #{reg.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-medium text-foreground">
                            <TicketIcon className="w-4 h-4 text-accent shrink-0" />
                            <span>
                              {reg.nombre_tipo_entrada || `Entrada #${reg.id_tipo_entrada}`}
                            </span>
                          </div>
                          {reg.nombre_festival && (
                            <p className="text-xs text-muted-foreground ml-6">
                              {reg.nombre_festival}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground line-through">
                          {formatearPrecioCLP(anterior)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-foreground">
                          {formatearPrecioCLP(nuevo)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              esAlza
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {esAlza ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {esAlza ? `+${porcentaje}%` : `${porcentaje}%`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-foreground">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>
                              {reg.nombre_productor
                                ? `${reg.nombre_productor} ${reg.apellido_productor}`
                                : `ID #${reg.id_productor}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            <span>{formatearFecha(reg.fecha_modificacion)}</span>
                          </div>
                          <span className="ml-5 block text-[11px]">
                            {formatearHora(reg.fecha_modificacion)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            disabled={loadingDetalle}
                            onClick={() => verDetalleRegistro(reg.id)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Detalle
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AuditoriaPage;