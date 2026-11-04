import { useState, useEffect } from 'react';
import { Copy, CheckCircle, AlertCircle, Loader, Clock, Ticket as TicketIcon, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ticketService from '@/services/ticket.service';
import { useAuth } from '@/contexts/AuthContext';
import type { TicketEnriquecido } from '@/interfaces/ticket.interface';

function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketEnriquecido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Cargar tickets del usuario
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ticketService.getTicketsByUser();
        setTickets(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar tus tickets';
        setError(message);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // Copiar código al portapapeles
  const handleCopyCode = async (codigo: string) => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiedCode(codigo);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Error al copiar código:', err);
    }
  };

  // Obtener color según estado del ticket
  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'VALIDO':
        return 'bg-green-100 text-green-800';
      case 'UTILIZADO':
        return 'bg-blue-100 text-blue-800';
      case 'ANULADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener ícono según estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'VALIDO':
        return <CheckCircle className="w-4 h-4" />;
      case 'UTILIZADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'ANULADO':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Agrupar tickets por orden de compra
  const ticketsAgrupados = tickets.reduce(
    (acc, ticket) => {
      const key = ticket.id_orden_compra;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ticket);
      return acc;
    },
    {} as Record<number, TicketEnriquecido[]>
  );

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TicketIcon className="w-8 h-8 text-accent" />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Mis Tickets</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {user?.nombre}, aquí puedes ver todos tus tickets de entrada
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-accent animate-spin mb-4" />
            <p className="text-muted-foreground">Cargando tus tickets...</p>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50 m-3">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Error al cargar tickets</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <TicketIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No tienes tickets</h3>
              <p className="text-muted-foreground text-center mb-6">
                Compra tickets de tus festivales favoritos para verlos aquí
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total de Tickets</p>
                    <p className="text-3xl font-bold text-foreground">{tickets.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Disponibles</p>
                    <p className="text-3xl font-bold text-green-600">
                      {tickets.filter((t) => t.estado === 'VALIDO').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Utilizados</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {tickets.filter((t) => t.estado === 'UTILIZADO').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tickets agrupados por orden */}
            <div className="space-y-6">
              {Object.entries(ticketsAgrupados).map(([ordenId, ticketsDeOrden]: [string, TicketEnriquecido[]]) => (
                <div key={ordenId} className="space-y-3">
                  <h2 className="text-lg font-semibold text-foreground">Orden #{ordenId}</h2>

                  <div className="space-y-3">
                    {ticketsDeOrden.map((ticket: TicketEnriquecido) => (
                      <Card key={`${ticket.id_orden_compra}-${ticket.id}`} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">Ticket #{ticket.id}</CardTitle>
                              <CardDescription className="space-y-1">
                                <div>
                                  {ticket.tipo_entrada_nombre 
                                    ? `${ticket.tipo_entrada_nombre}` 
                                    : `ID Tipo Entrada: ${ticket.id_tipo_entrada}`}
                                </div>
                              </CardDescription>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getEstadoColor(
                                ticket.estado
                              )}`}
                            >
                              {getEstadoIcon(ticket.estado)}
                              {ticket.estado}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Código Único */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Código Único</label>
                            <div className="flex gap-2 items-center">
                              <div className="flex-1 p-3 rounded-lg bg-muted text-sm break-all">
                                {ticket.codigo_unico}
                              </div>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleCopyCode(ticket.codigo_unico)}
                                title="Copiar código"
                              >
                                {copiedCode === ticket.codigo_unico ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Información */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {ticket.festival && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Festival</p>
                                <p className="text-sm font-semibold text-accent">
                                  {ticket.festival}
                                </p>
                              </div>
                            )}
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground">Tipo de Entrada</p>
                              <p className="text-sm font-semibold text-foreground">
                                {ticket.tipo_entrada_nombre || `ID: ${ticket.id_tipo_entrada}`}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground">Orden Compra</p>
                              <p className="text-sm font-semibold text-foreground">#{ticket.id_orden_compra}</p>
                            </div>
                          </div>

                          {/* Fecha de Uso */}
                          {ticket.fecha_uso && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs font-medium text-blue-800">Utilizado</p>
                                <p className="text-sm text-blue-700">
                                  {new Date(ticket.fecha_uso).toLocaleDateString('es-ES')} a las{' '}
                                  {new Date(ticket.fecha_uso).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Instrucciones */}
                          {ticket.estado === 'VALIDO' && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                              <KeyRound className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm text-green-700">
                                  Presenta este código en la entrada del evento
                                </p>
                              </div>
                            </div>
                          )}

                          {ticket.estado === 'ANULADO' && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-red-800">Ticket Cancelado</p>
                                <p className="text-sm text-red-700">
                                  Este ticket ha sido cancelado. Contacta con soporte para más información.
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTickets;
