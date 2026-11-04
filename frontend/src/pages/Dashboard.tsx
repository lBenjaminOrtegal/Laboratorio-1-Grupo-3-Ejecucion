import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader,
  BarChart3,
  DollarSign,
  Ticket as TicketIcon,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import reporteService from '@/services/reporte.service';
import type { ReporteVentasOcupacion } from '@/interfaces/reporte.interface';

// Interfaz para agrupar los datos visualmente por festival
interface FestivalAgrupado {
  id_festival: number;
  nombre_festival: string;
  recaudacion_total: number;
  tickets_vendidos: number;
  entradas: ReporteVentasOcupacion[];
}

function ReportesPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ReporteVentasOcupacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatearPrecioCLP = (precio: number | string) => {
    return Number(precio).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  useEffect(() => {
    const loadReporte = async () => {
      try {
        setLoading(true);
        const response = await reporteService.getVentasOcupacion();
        const reporteData: ReporteVentasOcupacion[] = response.data?.data || response.data;
        setData(reporteData);
        setError(null);
      } catch (err) {
        console.error('Error al cargar el reporte:', err);
        setError('No se pudo cargar la información de ventas y ocupación.');
      } finally {
        setLoading(false);
      }
    };

    loadReporte();
  }, []);

  // Agrupar los datos por festival para mostrarlos ordenados
  const festivalesAgrupados = data.reduce((acc: Record<number, FestivalAgrupado>, curr) => {
    if (!acc[curr.id_festival]) {
      acc[curr.id_festival] = {
        id_festival: curr.id_festival,
        nombre_festival: curr.nombre_festival,
        recaudacion_total: 0,
        tickets_vendidos: 0,
        entradas: [],
      };
    }
    acc[curr.id_festival].entradas.push(curr);
    acc[curr.id_festival].recaudacion_total += Number(curr.recaudacion_total);
    acc[curr.id_festival].tickets_vendidos += Number(curr.tickets_vendidos);
    return acc;
  }, {});

  const listaFestivales = Object.values(festivalesAgrupados);

  // Calcular totales globales (Dashboard)
  const totalRecaudacionGlobal = listaFestivales.reduce((sum, f) => sum + f.recaudacion_total, 0);
  const totalTicketsGlobal = listaFestivales.reduce((sum, f) => sum + f.tickets_vendidos, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-muted-foreground">Generando reporte de ventas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" className="gap-2 mb-6" onClick={() => navigate('/dashboard')}>
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
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/15 via-accent/10 to-background border-b border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Panel
          </Button>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground flex items-center gap-4">
              <BarChart3 className="w-10 h-10 text-accent" />
              Reporte de Ventas y Ocupación
            </h1>
            <p className="text-muted-foreground text-lg">
              Métricas de recaudación y aforo actualizadas al día de hoy.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* KPIs Globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-accent">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-4 rounded-full bg-accent/10 text-accent">
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recaudación Global</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {formatearPrecioCLP(totalRecaudacionGlobal)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <TicketIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tickets Vendidos (Totales)</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {totalTicketsGlobal.toLocaleString('es-CL')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desglose por Festival */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-4">
            Desglose por Festival
          </h2>

          {listaFestivales.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No hay datos de ventas registrados aún.</p>
              </CardContent>
            </Card>
          ) : (
            listaFestivales.map((festival) => (
              <Card key={festival.id_festival} className="overflow-hidden">
                {/* Cabecera del Festival */}
                <div className="bg-muted/40 p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-bold">{festival.nombre_festival}</h3>
                  </div>
                  <div className="flex items-center gap-6 text-sm font-medium">
                    <span className="text-muted-foreground">
                      Tickets: <span className="text-foreground">{festival.tickets_vendidos}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Recaudación:{' '}
                      <span className="text-green-600 font-bold">
                        {formatearPrecioCLP(festival.recaudacion_total)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Tabla de Tipos de Entrada */}
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-medium">Tipo de Entrada</th>
                        <th className="px-6 py-4 font-medium text-center">Stock Inicial</th>
                        <th className="px-6 py-4 font-medium text-center">Vendidos</th>
                        <th className="px-6 py-4 font-medium text-center">Aforo Vendido</th>
                        <th className="px-6 py-4 font-medium text-right">Recaudación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {festival.entradas.map((entrada) => (
                        <tr key={entrada.id_tipo_entrada} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">
                            {entrada.nombre_tipo_entrada}
                          </td>
                          <td className="px-6 py-4 text-center text-muted-foreground">
                            {entrada.stock_inicial}
                          </td>
                          <td className="px-6 py-4 text-center font-medium">
                            {entrada.tickets_vendidos}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <TrendingUp className={`w-4 h-4 ${Number(entrada.porcentaje_aforo_vendido) > 80 ? 'text-green-500' : 'text-accent'}`} />
                              <span className={Number(entrada.porcentaje_aforo_vendido) > 80 ? 'text-green-600 font-bold' : ''}>
                                {Number(entrada.porcentaje_aforo_vendido).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-foreground">
                            {formatearPrecioCLP(entrada.recaudacion_total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportesPage;