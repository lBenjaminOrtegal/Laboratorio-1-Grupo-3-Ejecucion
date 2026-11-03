import { useState, useEffect } from 'react';
import { ShoppingCart, AlertCircle, Loader, RefreshCw, CheckCircle, Clock, XCircle, HandCoins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ordenCompraService from '@/services/orden_compra.service';
import { useAuth } from '@/contexts/AuthContext';
import type { OrdenCompra } from '@/interfaces/orden_compra.interface';

// Utilidad para convertir monto de string o number a number
const toNumber = (value: string | number): number => {
  if (typeof value === 'string') {
    return parseFloat(value) || 0;
  }
  return value || 0;
};

function MyPurchases() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar órdenes del usuario
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ordenCompraService.getMyOrders();
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar tus órdenes de compra';
        setError(message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Obtener color según estado de la orden
  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'PAGADO':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      case 'FALLIDO':
        return 'bg-red-100 text-red-800';
      case 'REEMBOLSADO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener ícono según estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'PAGADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDIENTE':
        return <Clock className="w-4 h-4" />;
      case 'CANCELADO':
      case 'FALLIDO':
        return <XCircle className="w-4 h-4" />;
      case 'REEMBOLSADO':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Obtener etiqueta de estado en español
  const getEstadoLabel = (estado: string): string => {
    switch (estado) {
      case 'PAGADO':
        return 'Pagado';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'CANCELADO':
        return 'Cancelado';
      case 'FALLIDO':
        return 'Fallido';
      case 'REEMBOLSADO':
        return 'Reembolsado';
      default:
        return estado;
    }
  };

  // Obtener método de pago en español
  const getMetodoPagoLabel = (metodo: string): string => {
    switch (metodo) {
      case 'TARJETA_CREDITO':
        return 'Tarjeta de Crédito';
      case 'TARJETA_DEBITO':
        return 'Tarjeta de Débito';
      default:
        return metodo;
    }
  };

  // Calcular estadísticas
  const stats = {
    total: orders.length,
    pagadas: orders.filter(o => o.estado === 'PAGADO').length,
    pendientes: orders.filter(o => o.estado === 'PENDIENTE').length,
    fallidas: orders.filter(o => o.estado === 'FALLIDO' || o.estado === 'CANCELADO').length,
    montoTotal: orders
      .filter(o => o.estado === 'PAGADO')
      .reduce((sum, o) => sum + toNumber(o.monto), 0),
  };

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-accent" />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Mis Compras</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {user?.nombre}, aquí puedes ver todas tus órdenes de compra
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-accent animate-spin mb-4" />
            <p className="text-muted-foreground">Cargando tus órdenes de compra...</p>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Error al cargar órdenes</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No tienes órdenes de compra</h3>
              <p className="text-muted-foreground text-center mb-6">
                Aún no has realizado ninguna compra. ¡Compra tickets para disfrutar de los festivales!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total de Órdenes</p>
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Pagadas</p>
                    <p className="text-3xl font-bold text-green-600">{stats.pagadas}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Pendientes</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendientes}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Monto Total Pagado</p>
                    <p className="text-3xl font-bold text-accent">
                      ${stats.montoTotal.toLocaleString('es-CL')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Órdenes */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Historial de Órdenes</h2>

              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">Orden #{order.id}</CardTitle>
                        <CardDescription>
                          {new Date(order.fecha_compra).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })} a las{' '}
                          {new Date(order.fecha_compra).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getEstadoColor(
                          order.estado
                        )}`}
                      >
                        {getEstadoIcon(order.estado)}
                        {getEstadoLabel(order.estado)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Información principal */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1 flex items-center gap-2">
                        <HandCoins className="w-4 h-4 text-accent flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Monto</p>
                          <p className="text-sm font-semibold text-foreground">
                            ${toNumber(order.monto).toLocaleString('es-CL')}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Método de Pago</p>
                        <p className="text-sm font-semibold text-foreground">
                          {getMetodoPagoLabel(order.metodo_pago)}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Estado de Pago</p>
                        <p className="text-sm font-semibold text-foreground">
                          {getEstadoLabel(order.estado)}
                        </p>
                      </div>
                    </div>

                    {/* Información adicional según estado */}
                    {order.estado === 'PENDIENTE' && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Pendiente de Pago</p>
                        </div>
                      </div>
                    )}

                    {order.estado === 'PAGADO' && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Pagado Exitosamente</p>
                        </div>
                      </div>
                    )}

                    {(order.estado === 'FALLIDO' || order.estado === 'CANCELADO') && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Orden Cancelada</p>
                        </div>
                      </div>
                    )}

                    {order.estado === 'REEMBOLSADO' && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <RefreshCw className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Reembolsado</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPurchases;
