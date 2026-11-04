import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Ticket as TicketIcon,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import tipoEntradaService from '@/services/tipo_entrada.service';
import festivalService from '@/services/festival.service';
import ticketService from '@/services/ticket.service';
import type { TipoEntrada } from '@/interfaces/tipo_entrada.interface';
import type { Festival } from '@/interfaces/festival.interface';
import type { MetodoPago, TicketEnriquecido } from '@/interfaces/ticket.interface';
import { formatearFecha } from '@/utils/formatUtils';

function BuyTicket() {
  const { idTipoEntrada } = useParams<{ idTipoEntrada: string }>();
  const navigate = useNavigate();

  const [tipoEntrada, setTipoEntrada] = useState<TipoEntrada | null>(null);
  const [festival, setFestival] = useState<Festival | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('TARJETA_DEBITO');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketsComprados, setTicketsComprados] = useState<TicketEnriquecido[] | null>(null);

  const formatearPrecioCLP = (precio: number | string) => {
    return Number(precio).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  useEffect(() => {
    const loadData = async () => {
      if (!idTipoEntrada) return;
      try {
        setLoading(true);
        const tipoId = Number(idTipoEntrada);

        const resTipo = await tipoEntradaService.getById(tipoId);
        const dataTipo: TipoEntrada = resTipo.data?.data || resTipo.data;
        setTipoEntrada(dataTipo);

        if (dataTipo?.id_festival) {
          const resFest = await festivalService.getById(Number(dataTipo.id_festival));
          const dataFest: Festival = resFest.data?.data || resFest.data;
          setFestival(dataFest);
        }
      } catch (err) {
        console.error('Error al cargar datos de la entrada:', err);
        setError('No se pudo cargar la información del tipo de entrada.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [idTipoEntrada]);

  const handleComprar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoEntrada) return;

    if (cantidad < 1 || cantidad > tipoEntrada.stock_disponible) {
      setError(`Selecciona una cantidad válida (entre 1 y ${tipoEntrada.stock_disponible}).`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await ticketService.buyTickets({
        id_tipo_entrada: tipoEntrada.id,
        cantidad,
        metodo_pago: metodoPago,
      });

      const creados = response.data?.data || [];
      setTicketsComprados(creados);
    } catch (err: any) {
      console.error('Error en la compra:', err);
      const backendMsg =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        'No se pudo procesar la compra. Verifica tu sesión o el stock disponible.';
      setError(backendMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-10 h-10 text-accent animate-spin mb-4" />
        <p className="text-muted-foreground">Preparando tu compra...</p>
      </div>
    );
  }

  if (!tipoEntrada) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <Button variant="ghost" className="gap-2 mb-6" onClick={() => navigate('/festivals')}>
          <ArrowLeft className="w-4 h-4" />
          Volver a Festivales
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error || 'Tipo de entrada no encontrado.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPagar = Number(tipoEntrada.precio) * (cantidad || 0);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        onClick={() =>
          festival ? navigate(`/festivals/${festival.id}`) : navigate('/festivals')
        }
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al Festival
      </Button>

      {ticketsComprados ? (
        <Card className="border-green-200 shadow-md">
          <CardHeader className="text-center pb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-2xl">¡Compra realizada con éxito!</CardTitle>
            <CardDescription>
              Se han generado {ticketsComprados.length} entrada(s) para{' '}
              <span className="font-semibold text-foreground">{tipoEntrada.nombre}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/40 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Orden de Compra:</span>
                <span className="font-semibold">#{ticketsComprados[0]?.id_orden_compra}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Pagado:</span>
                <span className="font-bold text-foreground">{formatearPrecioCLP(totalPagar)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button className="flex-1" onClick={() => navigate('/my-tickets')}>
                Ver Mis Tickets
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/my-purchases')}
              >
                Ver Mis Compras
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardHeader className="border-b border-border pb-6">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {festival?.nombre || 'Compra de Entradas'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                {tipoEntrada.stock_disponible} disponibles
              </span>
            </div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TicketIcon className="w-6 h-6 text-accent" />
              {tipoEntrada.nombre}
            </CardTitle>
            {tipoEntrada.descripcion && (
              <CardDescription className="pt-1">{tipoEntrada.descripcion}</CardDescription>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span>Fecha de acceso: {formatearFecha(tipoEntrada.fecha_acceso)}</span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleComprar} className="space-y-6">
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Selector de Cantidad */}
              <div className="space-y-2">
                <label htmlFor="cantidad" className="text-sm font-medium text-foreground">
                  Cantidad de entradas
                </label>
                <Input
                  id="cantidad"
                  type="number"
                  min={1}
                  max={tipoEntrada.stock_disponible}
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                  required
                />
              </div>

              {/* Selector de Método de Pago */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-accent" />
                  Método de pago
                </label>
                <Select
                  value={metodoPago}
                  onValueChange={(val) => setMetodoPago(val as MetodoPago)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TARJETA_DEBITO">Tarjeta de Débito</SelectItem>
                    <SelectItem value="TARJETA_CREDITO">Tarjeta de Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resumen de Pago */}
              <div className="rounded-lg bg-muted/40 p-4 space-y-2 border border-border">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Precio unitario</span>
                  <span>{formatearPrecioCLP(tipoEntrada.precio)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Cantidad</span>
                  <span>x {cantidad}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                  <span>Total a pagar</span>
                  <span>{formatearPrecioCLP(totalPagar)}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={submitting || tipoEntrada.stock_disponible <= 0}
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Procesando compra...
                  </>
                ) : (
                  <>
                    <TicketIcon className="w-4 h-4" />
                    Confirmar y Pagar {formatearPrecioCLP(totalPagar)}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BuyTicket;