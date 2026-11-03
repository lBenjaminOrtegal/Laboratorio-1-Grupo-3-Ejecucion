import { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Loader,
  Ticket,
  RefreshCw,
  Info,
  Clock,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ticketService from '@/services/ticket.service';
import type { TicketValidationResult } from '@/interfaces/ticket.interface';
import type { ValidationHistoryEntry } from '@/interfaces/validation.interface';

function AccessControl() {
  const [ticketCode, setTicketCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<TicketValidationResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<ValidationHistoryEntry[]>([]);

  const handleValidateTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketCode.trim()) {
      setValidationResult({
        success: false,
        message: 'Por favor ingresa un código de ticket',
      });
      return;
    }

    try {
      setLoading(true);
      setValidationResult(null);

      const response = await ticketService.validateTicket(ticketCode.trim());

      const result: TicketValidationResult = {
        success: true,
        message: 'Ticket validado correctamente',
        data: response.data.data,  // response.data = {mensaje, data}, así que necesitamos .data.data
      };

      setValidationResult(result);

      // Agregar al historial
      setSearchHistory((prev) => [
        {
          code: ticketCode.trim(),
          timestamp: new Date(),
          success: true,
          message: 'Ticket válido',
        },
        ...prev.slice(0, 19), // Mantener últimos 20 registros
      ]);

      // Limpiar input después de validación exitosa
      setTicketCode('');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        error.message ||
        'Error al validar el ticket';

      const result: TicketValidationResult = {
        success: false,
        message: errorMessage,
        error: errorMessage,
        status: error.response?.status,
        data: error.response?.data?.data,  // Incluir datos del ticket si existen (ej. ticket ya utilizado)
      };

      setValidationResult(result);

      // Agregar al historial
      setSearchHistory((prev) => [
        {
          code: ticketCode.trim(),
          timestamp: new Date(),
          success: false,
          message: errorMessage,
        },
        ...prev.slice(0, 19),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    setValidationResult(null);
    setTicketCode('');
  };

  // Función para obtener mensaje de error descriptivo y consejos
  const getErrorDetails = (errorMessage: string, status?: number) => {
    const normalizedMessage = errorMessage.toLowerCase();

    if (normalizedMessage.includes('no encontrado')) {
      return {
        title: 'Ticket No Encontrado',
        description: 'El código ingresado no existe en el sistema.',
        suggestion: 'Verifica que el código sea correcto y vuelve a intentar.',
        icon: <XCircle className="w-6 h-6 text-red-600" />,
      };
    }

    if (normalizedMessage.includes('utilizado')) {
      return {
        title: 'Ticket Ya Utilizado',
        description: 'Este ticket ya fue canjeado previamente.',
        suggestion: 'Si crees que es un error, contacta con soporte.',
        icon: <Clock className="w-6 h-6 text-orange-600" />,
      };
    }

    if (normalizedMessage.includes('anulado')) {
      return {
        title: 'Ticket Cancelado',
        description: 'Este ticket ha sido cancelado o anulado.',
        suggestion: 'Contacta con el organizador del evento para más información.',
        icon: <XCircle className="w-6 h-6 text-red-600" />,
      };
    }

    if (status === 400) {
      return {
        title: 'Código Inválido',
        description: 'El formato del código no es válido.',
        suggestion: 'Asegúrate de que el código esté completo y sea correcto.',
        icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      };
    }

    return {
      title: 'Error al Validar',
      description: errorMessage || 'Ocurrió un error inesperado.',
      suggestion: 'Intenta nuevamente o contacta con soporte.',
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
    };
  };

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-2">
                <Ticket className="w-8 h-8 text-accent" />
                Control de Acceso
              </h1>
              <p className="text-muted-foreground mt-1">
                Valida tickets ingresando el código único
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Scanner */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Validar Ticket</CardTitle>
                <CardDescription>
                  Ingresa el código único del ticket para validar la entrada al evento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleValidateTicket} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="ticket-code" className="block text-sm font-medium text-foreground">
                      Código Único del Ticket
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="ticket-code"
                        placeholder="Ingresa el código"
                        value={ticketCode}
                        onChange={(e) => setTicketCode(e.target.value)}
                        disabled={loading}
                        autoFocus
                        className="text-lg"
                      />
                      <Button
                        type="submit"
                        disabled={loading || !ticketCode.trim()}
                        size="icon"
                        className="flex-shrink-0"
                      >
                        {loading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Validation Result */}
            {validationResult && (
              <Card
                className={
                  validationResult.success
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {validationResult.success ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      getErrorDetails(validationResult.message, validationResult.status)?.icon
                    )}
                    <div className="flex-1">
                      <h3
                        className={`font-semibold mb-2 ${
                          validationResult.success ? 'text-green-800' : 'text-red-800'
                        }`}
                      >
                        {validationResult.success
                          ? validationResult.message
                          : getErrorDetails(validationResult.message, validationResult.status)?.title}
                      </h3>

                      {validationResult.success ? (
                        // Mostrar datos del ticket exitoso
                        validationResult.data && (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 border-b border-green-200">
                              <span className="font-medium">Código:</span>
                              <span>{validationResult.data.codigo_unico}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-green-200">
                              <span className="font-medium">ID Orden:</span>
                              <span>#{validationResult.data.id_orden_compra}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-green-200">
                              <span className="font-medium">Tipo de Entrada:</span>
                              <span>
                                {validationResult.data.tipo_entrada_nombre
                                  ? validationResult.data.tipo_entrada_nombre
                                  : `ID: ${validationResult.data.id_tipo_entrada}`}
                              </span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="font-medium">Estado:</span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  validationResult.data.estado === 'VALIDO'
                                    ? 'bg-green-200 text-green-800'
                                    : validationResult.data.estado === 'UTILIZADO'
                                    ? 'bg-blue-200 text-blue-800'
                                    : 'bg-red-200 text-red-800'
                                }`}
                              >
                                {validationResult.data.estado}
                              </span>
                            </div>
                            {validationResult.data.fecha_uso && (
                              <div className="flex justify-between py-2 border-t border-green-200 pt-2">
                                <span className="font-medium">Fecha de Uso:</span>
                                <span>
                                  {new Date(validationResult.data.fecha_uso).toLocaleDateString('es-ES')} a las{' '}
                                  {new Date(validationResult.data.fecha_uso).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      ) : (
                        // Mostrar detalles de error
                        <div className="space-y-3">
                          <p className="text-sm text-red-700">
                            {getErrorDetails(validationResult.message, validationResult.status)?.description}
                          </p>
                          <div className="p-3 rounded-lg bg-red-100 border border-red-300 flex gap-2">
                            <Info className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700">
                              {getErrorDetails(validationResult.message, validationResult.status)?.suggestion}
                            </p>
                          </div>
                          <div className="text-xs text-red-600 pt-2 border-t border-red-200">
                            <p>
                              <span className="font-medium">Código ingresado:</span> {ticketCode}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - History */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Historial Reciente</CardTitle>
                  {searchHistory.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearHistory}
                      className="gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Limpiar
                    </Button>
                  )}
                </div>
                <CardDescription>
                  Últimas validaciones ({searchHistory.length})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No hay registros todavía
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {searchHistory.map((entry, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          entry.success
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {entry.success ? (
                            <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs break-all truncate">
                              {entry.code}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                entry.success ? 'text-green-700' : 'text-red-700'
                              }`}
                            >
                              {entry.message}
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">
                              {entry.timestamp.toLocaleTimeString('es-ES')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessControl;
