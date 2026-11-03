import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Plus,
  Music,
  Calendar,
  MapPin,
  AlertCircle,
  Loader,
  CheckCircle,
  XCircle,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import festivalService from '@/services/festival.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Festival, UpdateFestivalDTO, EstadoFestival } from '@/interfaces/festival.interface';
import { getStatusColor } from '@/utils/formatUtils';

function ManageFestivals() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateFestivalDTO | null>(null);

  // Cargar festivales del productor
  const loadFestivals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await festivalService.getAll();

      // Filtrar solo los festivales del productor logueado
      const userFestivals = response.data.filter(
        (festival: Festival) => festival.id_productor === user?.id
      );

      setFestivals(userFestivals);

      if (userFestivals.length === 0) {
        setError('No tienes festivales creados aún.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar los festivales';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFestivals();
  }, [user?.id]);

  // Iniciar edición
  const startEdit = (festival: Festival) => {
    // Convertir fechas al formato que espera input datetime-local (YYYY-MM-DDTHH:mm)
    const convertToDateTimeLocal = (date: string | Date): string => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setEditingId(festival.id);
    setEditFormData({
      nombre: festival.nombre,
      fecha_inicio: convertToDateTimeLocal(festival.fecha_inicio),
      fecha_fin: convertToDateTimeLocal(festival.fecha_fin),
      estado: festival.estado,
    });
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  // Guardar cambios
  const handleSaveEdit = async (festivalId: number) => {
    if (!editFormData) return;

    try {
      setLoading(true);
      setError(null);

      // Validaciones básicas
      if (!editFormData.nombre?.trim()) {
        throw new Error('El nombre del festival es obligatorio');
      }

      if (editFormData.nombre.length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres');
      }

      if (editFormData.fecha_inicio && editFormData.fecha_fin) {
        const inicio = new Date(editFormData.fecha_inicio);
        const fin = new Date(editFormData.fecha_fin);
        if (inicio >= fin) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }

      await festivalService.update(festivalId, editFormData);

      setSuccessMessage('Festival actualizado correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Recargar festivales
      loadFestivals();
      cancelEdit();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el festival';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar festival
  const handleDelete = async (festivalId: number) => {
    if (
      !confirm(
        '¿Estás seguro de que quieres eliminar este festival? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setDeletingId(festivalId);
      setError(null);

      await festivalService.deleteById(festivalId);

      setSuccessMessage('Festival eliminado correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Recargar festivales
      loadFestivals();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar el festival';
      setError(message);
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  // Cambiar estado del festival
  const handleStatusChange = async (festivalId: number, newStatus: EstadoFestival) => {
    try {
      setError(null);
      await festivalService.update(festivalId, { estado: newStatus });

      setSuccessMessage(`Festival marcado como ${newStatus.toLowerCase()}`);
      setTimeout(() => setSuccessMessage(null), 3000);

      loadFestivals();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar el estado';
      setError(message);
    }
  };

  const getEstadoIcon = (estado: EstadoFestival) => {
    switch (estado) {
      case 'ACTIVO':
        return <CheckCircle className="w-4 h-4" />;
      case 'FINALIZADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELADO':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-2">
                <Music className="w-8 h-8 text-accent" />
                Gestionar Festivales
              </h1>
              <p className="text-muted-foreground mt-1">
                Edita y administra tus festivales
              </p>
            </div>
            <Button size="sm" variant="default" onClick={() => navigate('/create-festival')} className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Festival
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 flex gap-3 p-4 rounded-lg bg-green-50 border border-green-200 animate-in fade-in slide-in-from-top">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !editingId && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 text-accent animate-spin" />
              <p className="text-muted-foreground">Cargando festivales...</p>
            </div>
          </div>
        )}

        {/* Festivals List */}
        {!loading && festivals.length > 0 && (
          <div className="space-y-4">
            {festivals.map((festival) => (
              <Card
                key={festival.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {editingId === festival.id && editFormData ? (
                  // Edit Mode
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Nombre del Festival
                        </label>
                        <Input
                          value={editFormData.nombre || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, nombre: e.target.value })
                          }
                          placeholder="Nombre del festival"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Fecha de Inicio
                          </label>
                          <Input
                            type="datetime-local"
                            value={editFormData.fecha_inicio || ''}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                fecha_inicio: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Fecha de Fin
                          </label>
                          <Input
                            type="datetime-local"
                            value={editFormData.fecha_fin || ''}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                fecha_fin: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Estado
                        </label>
                        <Select
                          value={editFormData.estado || 'ACTIVO'}
                          onValueChange={(value) =>
                            setEditFormData({ ...editFormData, estado: value as EstadoFestival })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVO">Activo</SelectItem>
                            <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                            <SelectItem value="CANCELADO">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-4 border-t border-border">
                      <Button variant="outline" onClick={cancelEdit} disabled={loading}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => handleSaveEdit(festival.id)}
                        disabled={loading}
                      >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </CardContent>
                ) : (
                  // View Mode
                  <>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{festival.nombre}</CardTitle>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {new Date(festival.fecha_inicio).toLocaleDateString('es-ES')} -{' '}
                              {new Date(festival.fecha_fin).toLocaleDateString('es-ES')}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {festival.ciudad_recinto}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                            festival.estado
                          )}`}
                        >
                          {getEstadoIcon(festival.estado)}
                          {festival.estado}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <p>
                          <span className="font-semibold">Recinto:</span> {festival.nombre_recinto}
                        </p>
                        <p>
                          <span className="font-semibold">Dirección:</span>{' '}
                          {festival.direccion_recinto}
                        </p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(festival)}
                          className="gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </Button>

                        {festival.estado !== 'FINALIZADO' && festival.estado !== 'CANCELADO' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(festival.id, 'FINALIZADO')}
                          >
                            <Check className="w-4 h-4"></Check>
                            Marcar Finalizado
                          </Button>
                        )}

                        {festival.estado !== 'CANCELADO' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusChange(festival.id, 'CANCELADO')}
                          >
                            <X className="w-4 h-4"></X>
                            Cancelar
                          </Button>
                        )}

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(festival.id)}
                          disabled={deletingId === festival.id}
                          className="gap-2 ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === festival.id ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && festivals.length === 0 && !error && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Sin festivales creados
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                No tienes festivales creados aún. ¡Crea uno para comenzar!
              </p>
              <Button onClick={() => navigate('/create-festival')} className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Primer Festival
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ManageFestivals;
