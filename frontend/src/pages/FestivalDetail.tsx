import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  User,
  ArrowLeft,
  Clock,
  Music,
  Ticket as TicketIcon,
  Loader,
  Building2,
  Mic2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import festivalService from '@/services/festival.service';
import presentacionService from '@/services/presentacion.service';
import tipoEntradaService from '@/services/tipo_entrada.service';
import type { Festival } from '@/interfaces/festival.interface';
import type {
  Presentacion,
  PresentacionesEscenario,
} from '@/interfaces/presentacion.interface';
import type { TipoEntrada } from '@/interfaces/tipo_entrada.interface';
import {
  formatearFecha,
  formatearHora,
  getStatusColor,
  getStatusLabel,
} from '@/utils/formatUtils';

function FestivalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [festival, setFestival] = useState<Festival | null>(null);
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([]);
  const [diasFestival, setDiasFestival] = useState<string[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>('TODOS');
  const [tiposEntrada, setTiposEntrada] = useState<TipoEntrada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatearPrecioCLP = (precio: number | string) => {
    return Number(precio).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  // Genera el arreglo de fechas YYYY-MM-DD entre fecha_inicio y fecha_fin
  const obtenerFechasRango = (inicioStr: string, finStr: string): string[] => {
    const fechas: string[] = [];
    const inicio = new Date(inicioStr);
    const fin = new Date(finStr);

    const actual = new Date(
      Date.UTC(inicio.getUTCFullYear(), inicio.getUTCMonth(), inicio.getUTCDate())
    );
    const limite = new Date(
      Date.UTC(fin.getUTCFullYear(), fin.getUTCMonth(), fin.getUTCDate())
    );

    while (actual <= limite) {
      fechas.push(actual.toISOString().split('T')[0]);
      actual.setUTCDate(actual.getUTCDate() + 1);
    }
    return fechas;
  };

  useEffect(() => {
    const loadFestivalDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const festivalId = Number(id);

        // 1. Cargar datos del festival
        const festResponse = await festivalService.getById(festivalId);
        const festData: Festival = festResponse.data?.data || festResponse.data;
        setFestival(festData);

        // 2. Cargar presentaciones enriquecidas usando getLineUp por cada día del festival
        if (festData?.fecha_inicio && festData?.fecha_fin) {
          const dias = obtenerFechasRango(
            festData.fecha_inicio.toString(),
            festData.fecha_fin.toString()
          );
          setDiasFestival(dias);

          try {
            const promesasLineUp = dias.map((fechaDia) =>
              presentacionService.getLineUp(festivalId, fechaDia)
            );
            const respuestas = await Promise.all(promesasLineUp);

            const presentacionesEnriquecidas: Presentacion[] = [];

            respuestas.forEach((res) => {
              const escenarios: PresentacionesEscenario[] = Array.isArray(res)
                ? res
                : Array.isArray(res?.data)
                ? res.data
                : [];


              escenarios.forEach((esc) => {
                if (Array.isArray(esc.presentaciones)) {
                  esc.presentaciones.forEach((pres) => {
                    presentacionesEnriquecidas.push({
                      ...pres,
                      id_escenario: pres.id_escenario ?? esc.id_escenario,
                      nombre_escenario: pres.nombre_escenario || esc.nombre_escenario,
                    });
                  });
                }
              });
            });

            setPresentaciones(presentacionesEnriquecidas);
          } catch (presErr) {
            console.warn('No se pudieron cargar las presentaciones del line-up:', presErr);
          }
        }

        // 3. Cargar tipos de entrada de este festival
        try {
          const tiposResponse = await tipoEntradaService.getAll();
          const allTipos: TipoEntrada[] = Array.isArray(tiposResponse.data)
            ? tiposResponse.data
            : tiposResponse.data?.data || [];

          const festTipos = allTipos.filter(
            (t) => Number(t.id_festival) === festivalId
          );
          setTiposEntrada(festTipos);
        } catch (tiposErr) {
          console.warn('No se pudieron cargar los tipos de entrada:', tiposErr);
        }

        setError(null);
      } catch (err) {
        console.error('Error al cargar el detalle del festival:', err);
        setError('No se pudo encontrar la información del festival.');
      } finally {
        setLoading(false);
      }
    };

    loadFestivalDetails();
  }, [id]);

  const presentacionesFiltradas =
    diaSeleccionado === 'TODOS'
      ? presentaciones
      : presentaciones.filter((p) =>
          p.fecha_inicio.toString().startsWith(diaSeleccionado)
        );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-muted-foreground">Cargando detalles del festival...</p>
      </div>
    );
  }

  if (error || !festival) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          className="gap-2 mb-6"
          onClick={() => navigate('/festivals')}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Festivales
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error || 'Festival no encontrado'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full bg-background pb-16">
      {/* Banner / Header del Festival */}
      <div className="bg-gradient-to-br from-accent/15 via-accent/10 to-background border-b border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/festivals')}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Festivales
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    festival.estado
                  )}`}
                >
                  {getStatusLabel(festival.estado)}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold text-foreground">
                {festival.nombre}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm sm:text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span>
                    {formatearFecha(festival.fecha_inicio.toString())} -{' '}
                    {formatearFecha(festival.fecha_fin.toString())}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>
                    {festival.nombre_recinto}, {festival.ciudad_recinto}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Button
                size="lg"
                className="w-full md:w-auto gap-2 shadow-sm"
                disabled={festival.estado !== 'ACTIVO'}
                onClick={() => {
                  const ticketSection = document.getElementById('seccion-entradas');
                  ticketSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <TicketIcon className="w-5 h-5" />
                {festival.estado === 'ACTIVO'
                  ? 'Ver Entradas'
                  : `Festival ${getStatusLabel(festival.estado)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Tarjetas de Información General */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10 text-accent">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fechas del Evento
                </p>
                <p className="text-base font-semibold text-foreground mt-1">
                  Del {formatearFecha(festival.fecha_inicio.toString())}
                </p>
                <p className="text-sm text-muted-foreground">
                  al {formatearFecha(festival.fecha_fin.toString())}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10 text-accent">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Recinto y Ubicación
                </p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {festival.nombre_recinto}
                </p>
                <p className="text-sm text-muted-foreground">
                  {festival.direccion_recinto
                    ? `${festival.direccion_recinto}, ${festival.ciudad_recinto}`
                    : festival.ciudad_recinto}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10 text-accent">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Producido por
                </p>
                <p className="text-base font-semibold text-foreground mt-1">
                  {festival.nombre_productor} {festival.apellido_productor}
                </p>
                <p className="text-sm text-muted-foreground">
                  Productor Oficial
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Line-Up / Presentaciones del Festival */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Music className="w-6 h-6 text-accent" />
                Artistas y Presentaciones
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Conoce los horarios, escenarios y artistas confirmados
              </p>
            </div>

            {/* Filtro rápido por día del festival */}
            {diasFestival.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={diaSeleccionado === 'TODOS' ? 'default' : 'outline'}
                  onClick={() => setDiaSeleccionado('TODOS')}
                >
                  Todos los días
                </Button>
                {diasFestival.map((dia) => (
                  <Button
                    key={dia}
                    size="sm"
                    variant={diaSeleccionado === dia ? 'default' : 'outline'}
                    onClick={() => setDiaSeleccionado(dia)}
                  >
                    {formatearFecha(`${dia}T12:00:00Z`)}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {presentacionesFiltradas.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="py-12 text-center">
                <Music className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No hay presentaciones registradas para el día seleccionado.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presentacionesFiltradas.map((pres, index) => (
                <Card
                  key={`${pres.id_presentacion ?? index}-${pres.fecha_inicio}`}
                  className="hover:border-accent/60 transition-colors"
                >
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {pres.nombre_artista}
                        </h3>
                        {pres.genero_artista && (
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                            {pres.nombre_artista}
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          pres.estado === 'PROGRAMADA'
                            ? 'bg-green-100 text-green-800'
                            : pres.estado === 'CANCELADA'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {pres.estado}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Mic2 className="w-4 h-4 text-accent" />
                        <span className="font-medium text-foreground">
                          {pres.nombre_escenario}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{formatearFecha(pres.fecha_inicio.toString())}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>
                          {formatearHora(pres.fecha_inicio)} -{' '}
                          {formatearHora(pres.fecha_fin)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sección de Tipos de Entrada Disponibles */}
        <div id="seccion-entradas" className="space-y-6 pt-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <TicketIcon className="w-6 h-6 text-accent" />
              Entradas Disponibles
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Elige tu tipo de pase para {festival.nombre}
            </p>
          </div>

          {tiposEntrada.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="py-12 text-center">
                <TicketIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No hay tipos de entrada configurados para este festival.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiposEntrada.map((tipo) => {
                const agotado = tipo.stock_disponible <= 0;
                return (
                  <Card
                    key={tipo.id}
                    className="flex flex-col justify-between hover:border-accent transition-colors"
                  >
                    <CardContent className="pt-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-foreground">
                            {tipo.nombre}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                              agotado
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {agotado
                              ? 'Agotado'
                              : `${tipo.stock_disponible} disponibles`}
                          </span>
                        </div>

                        {tipo.descripcion && (
                          <p className="text-sm text-muted-foreground">
                            {tipo.descripcion}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                          <Calendar className="w-4 h-4 text-accent" />
                          <span>
                            Fecha acceso: {formatearFecha(tipo.fecha_acceso)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-muted-foreground">
                            Precio por entrada
                          </span>
                          <span className="text-2xl font-bold text-foreground">
                            {formatearPrecioCLP(tipo.precio)}
                          </span>
                        </div>

                        <Button
                          className="w-full gap-2"
                          disabled={festival.estado !== 'ACTIVO' || agotado}
                          onClick={() => navigate(`/buy-ticket/${tipo.id}`)}
                        >
                          <TicketIcon className="w-4 h-4" />
                          {agotado ? 'Sin Cupo' : 'Comprar Entrada'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FestivalDetail;