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
  Building2,
  Mic2,
  Users,
  Ticket as TicketIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import festivalService from '@/services/festival.service';
import recintoService from '@/services/recinto.service';
import artistaService from '@/services/artista.service';
import escenarioService from '@/services/escenario.service';
import tipoEntradaService from '@/services/tipo_entrada.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Festival, UpdateFestivalDTO, EstadoFestival } from '@/interfaces/festival.interface';
import type { Recinto } from '@/interfaces/recinto.interface';
import type { Artista } from '@/interfaces/artista.interface';
import type { Escenario } from '@/interfaces/escenario.interface';
import type { TipoEntrada } from '@/interfaces/tipo_entrada.interface';
import { getStatusColor } from '@/utils/formatUtils';

type ActiveTab = 'FESTIVALES' | 'RECINTOS' | 'ARTISTAS';

function ProducerPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('FESTIVALES');

  // Estados de Festivales
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateFestivalDTO | null>(null);

  // Estados de Escenarios (dentro de cada festival)
  const [escenarios, setEscenarios] = useState<Escenario[]>([]);
  const [openStagesFestivalId, setOpenStagesFestivalId] = useState<number | null>(null);
  const [newEscenario, setNewEscenario] = useState({ nombre: '', capacidad: '' });
  const [editingEscenarioId, setEditingEscenarioId] = useState<number | null>(null);
  const [editEscenarioData, setEditEscenarioData] = useState({ nombre: '', capacidad: '' });

  // Estados de Tipos de Entrada (dentro de cada festival)
  const [tiposEntrada, setTiposEntrada] = useState<TipoEntrada[]>([]);
  const [openTicketsFestivalId, setOpenTicketsFestivalId] = useState<number | null>(null);
  const [newTipoEntrada, setNewTipoEntrada] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    fecha_acceso: '',
  });
  const [editingTipoId, setEditingTipoId] = useState<number | null>(null);
  const [editTipoData, setEditTipoData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock_disponible: '',
    fecha_acceso: '',
  });

  // Estados de Recintos
  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [newRecinto, setNewRecinto] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    capacidad: '',
  });
  const [editingRecintoId, setEditingRecintoId] = useState<number | null>(null);
  const [editRecintoData, setEditRecintoData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    capacidad: '',
  });

  // Estados de Artistas
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [newArtista, setNewArtista] = useState({ nombre: '', genero: '', pais: '' });
  const [editingArtistaId, setEditingArtistaId] = useState<number | null>(null);
  const [editArtistaData, setEditArtistaData] = useState({ nombre: '', genero: '', pais: '' });

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // ==================== CARGA DE DATOS ====================
  const loadFestivals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await festivalService.getAll();
      const allFestivals: Festival[] = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      const userFestivals = allFestivals.filter(
        (festival: Festival) => Number(festival.id_productor) === Number(user?.id)
      );
      setFestivals(userFestivals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los festivales');
    } finally {
      setLoading(false);
    }
  };

  const loadEscenarios = async () => {
    try {
      const data = await escenarioService.getAll();
      const list: Escenario[] = Array.isArray(data) ? data : data?.data || [];
      setEscenarios(list);
    } catch (err) {
      console.error('Error al cargar escenarios:', err);
    }
  };

  const loadTiposEntrada = async () => {
    try {
      const res = await tipoEntradaService.getAll();
      const list: TipoEntrada[] = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setTiposEntrada(list);
    } catch (err) {
      console.error('Error al cargar tipos de entrada:', err);
    }
  };

  const loadRecintos = async () => {
    try {
      const res = await recintoService.getAll();
      const list: Recinto[] = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setRecintos(list);
    } catch (err) {
      console.error('Error al cargar recintos:', err);
    }
  };

  const loadArtistas = async () => {
    try {
      const data = await artistaService.getAll();
      const list: Artista[] = Array.isArray(data) ? data : data?.data || [];
      setArtistas(list);
    } catch (err) {
      console.error('Error al cargar artistas:', err);
    }
  };

  useEffect(() => {
    loadFestivals();
    loadEscenarios();
    loadTiposEntrada();
    loadRecintos();
    loadArtistas();
  }, [user?.id]);

  // ==================== LÓGICA DE FESTIVALES ====================
  const startEdit = (festival: Festival) => {
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

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const handleSaveEdit = async (festivalId: number) => {
    if (!editFormData) return;
    try {
      setLoading(true);
      setError(null);

      if (!editFormData.nombre?.trim() || editFormData.nombre.length < 3) {
        throw new Error('El nombre debe tener al menos 3 caracteres');
      }

      if (editFormData.fecha_inicio && editFormData.fecha_fin) {
        if (new Date(editFormData.fecha_inicio) >= new Date(editFormData.fecha_fin)) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }

      await festivalService.update(festivalId, editFormData);
      showSuccess('Festival actualizado correctamente');
      loadFestivals();
      cancelEdit();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar el festival');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (festivalId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este festival?')) return;
    try {
      setLoading(true);
      setDeletingId(festivalId);
      setError(null);
      await festivalService.deleteById(festivalId);
      showSuccess('Festival eliminado correctamente');
      loadFestivals();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar el festival');
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (festivalId: number, newStatus: EstadoFestival) => {
    try {
      setError(null);
      await festivalService.update(festivalId, { estado: newStatus });
      showSuccess(`Festival marcado como ${newStatus.toLowerCase()}`);
      loadFestivals();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cambiar el estado');
    }
  };

  // ==================== CRUD ESCENARIOS ====================
  const handleCreateEscenario = async (e: React.FormEvent, festivalId: number) => {
    e.preventDefault();
    try {
      setError(null);
      await escenarioService.create({
        nombre: newEscenario.nombre.trim(),
        capacidad: Number(newEscenario.capacidad),
        id_festival: festivalId,
      });
      setNewEscenario({ nombre: '', capacidad: '' });
      showSuccess('Escenario agregado al festival');
      loadEscenarios();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear escenario');
    }
  };

  const handleUpdateEscenario = async (id: number) => {
    try {
      setError(null);
      await escenarioService.update(id, {
        nombre: editEscenarioData.nombre.trim(),
        capacidad: Number(editEscenarioData.capacidad),
      });
      setEditingEscenarioId(null);
      showSuccess('Escenario actualizado');
      loadEscenarios();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar escenario');
    }
  };

  const handleDeleteEscenario = async (id: number) => {
    if (!confirm('¿Eliminar este escenario?')) return;
    try {
      setError(null);
      await escenarioService.delete(id);
      showSuccess('Escenario eliminado');
      loadEscenarios();
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se pudo eliminar el escenario');
    }
  };

  // ==================== CRUD TIPOS DE ENTRADA ====================
  const handleCreateTipoEntrada = async (e: React.FormEvent, festivalId: number) => {
    e.preventDefault();
    try {
      setError(null);
      const stockNum = Number(newTipoEntrada.stock);
      await tipoEntradaService.create({
        nombre: newTipoEntrada.nombre.trim(),
        descripcion: newTipoEntrada.descripcion.trim(),
        precio: Number(newTipoEntrada.precio),
        stock_inicial: stockNum,
        stock_disponible: stockNum,
        fecha_acceso: newTipoEntrada.fecha_acceso,
        id_festival: festivalId,
      });
      setNewTipoEntrada({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        fecha_acceso: '',
      });
      showSuccess('Tipo de entrada agregado al festival');
      loadTiposEntrada();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Error al crear el tipo de entrada'
      );
    }
  };

  const handleUpdateTipoEntrada = async (id: number) => {
    try {
      setError(null);
      await tipoEntradaService.update(id, {
        nombre: editTipoData.nombre.trim(),
        descripcion: editTipoData.descripcion.trim(),
        precio: Number(editTipoData.precio),
        stock_disponible: Number(editTipoData.stock_disponible),
        fecha_acceso: editTipoData.fecha_acceso,
      });
      setEditingTipoId(null);
      showSuccess('Tipo de entrada actualizado');
      loadTiposEntrada();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Error al actualizar tipo de entrada'
      );
    }
  };

  const handleDeleteTipoEntrada = async (id: number) => {
    if (!confirm('¿Eliminar este tipo de entrada?')) return;
    try {
      setError(null);
      await tipoEntradaService.deleteById(id);
      showSuccess('Tipo de entrada eliminado');
      loadTiposEntrada();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'No se puede eliminar un tipo de entrada que ya tiene tickets vendidos'
      );
    }
  };

  // ==================== CRUD RECINTOS ====================
  const handleCreateRecinto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await recintoService.create({
        nombre: newRecinto.nombre.trim(),
        direccion: newRecinto.direccion.trim(),
        ciudad: newRecinto.ciudad.trim(),
        capacidad: Number(newRecinto.capacidad),
      });
      setNewRecinto({ nombre: '', direccion: '', ciudad: '', capacidad: '' });
      showSuccess('Recinto creado correctamente');
      loadRecintos();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear recinto');
    }
  };

  const handleUpdateRecinto = async (id: number) => {
    try {
      setError(null);
      await recintoService.update(id, {
        nombre: editRecintoData.nombre.trim(),
        direccion: editRecintoData.direccion.trim(),
        ciudad: editRecintoData.ciudad.trim(),
        capacidad: Number(editRecintoData.capacidad),
      });
      setEditingRecintoId(null);
      showSuccess('Recinto actualizado');
      loadRecintos();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar recinto');
    }
  };

  const handleDeleteRecinto = async (id: number) => {
    if (!confirm('¿Eliminar este recinto?')) return;
    try {
      setError(null);
      await recintoService.deleteById(id);
      showSuccess('Recinto eliminado');
      loadRecintos();
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se puede eliminar un recinto en uso');
    }
  };

  // ==================== CRUD ARTISTAS ====================
  const handleCreateArtista = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await artistaService.create({
        nombre: newArtista.nombre.trim(),
        genero: newArtista.genero.trim(),
        pais: newArtista.pais.trim(),
      });
      setNewArtista({ nombre: '', genero: '', pais: '' });
      showSuccess('Artista registrado correctamente');
      loadArtistas();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear artista');
    }
  };

  const handleUpdateArtista = async (id: number) => {
    try {
      setError(null);
      await artistaService.update(id, {
        nombre: editArtistaData.nombre.trim(),
        genero: editArtistaData.genero.trim(),
        pais: editArtistaData.pais.trim(),
      });
      setEditingArtistaId(null);
      showSuccess('Artista actualizado');
      loadArtistas();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar artista');
    }
  };

  const handleDeleteArtista = async (id: number) => {
    if (!confirm('¿Eliminar este artista?')) return;
    try {
      setError(null);
      await artistaService.delete(id);
      showSuccess('Artista eliminado');
      loadArtistas();
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se puede eliminar un artista con presentaciones');
    }
  };

  const getEstadoIcon = (estado: EstadoFestival) => {
    switch (estado) {
      case 'ACTIVO':
      case 'FINALIZADO':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELADO':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-background pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-2">
                <Music className="w-8 h-8 text-accent" />
                Panel de Productor
              </h1>
              <p className="text-muted-foreground mt-1">
                Administra tus festivales, escenarios, entradas, recintos y catálogo de artistas
              </p>
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={() => navigate('/create-festival')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Festival
            </Button>
          </div>

          {/* Pestañas de Navegación del CRUD */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'FESTIVALES' ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => {
                setActiveTab('FESTIVALES');
                setError(null);
              }}
            >
              <Music className="w-4 h-4" />
              Mis Festivales ({festivals.length})
            </Button>
            <Button
              variant={activeTab === 'RECINTOS' ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => {
                setActiveTab('RECINTOS');
                setError(null);
              }}
            >
              <Building2 className="w-4 h-4" />
              Recintos ({recintos.length})
            </Button>
            <Button
              variant={activeTab === 'ARTISTAS' ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => {
                setActiveTab('ARTISTAS');
                setError(null);
              }}
            >
              <Users className="w-4 h-4" />
              Artistas ({artistas.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-6 flex gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* ==================== TAB 1: FESTIVALES, ESCENARIOS Y ENTRADAS ==================== */}
        {activeTab === 'FESTIVALES' && (
          <>
            {loading && !editingId ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : festivals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Music className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Sin festivales creados
                  </h3>
                  <Button onClick={() => navigate('/create-festival')} className="gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Crear Primer Festival
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {festivals.map((festival) => {
                  const festEscenarios = escenarios.filter(
                    (e) => Number(e.id_festival) === Number(festival.id)
                  );
                  const festTiposEntrada = tiposEntrada.filter(
                    (t) => Number(t.id_festival) === Number(festival.id)
                  );
                  const isStagesOpen = openStagesFestivalId === festival.id;
                  const isTicketsOpen = openTicketsFestivalId === festival.id;

                  return (
                    <Card key={festival.id} className="overflow-hidden">
                      {editingId === festival.id && editFormData ? (
                        <CardContent className="p-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Nombre del Festival
                            </label>
                            <Input
                              value={editFormData.nombre || ''}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, nombre: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
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
                              <label className="block text-sm font-medium mb-1">
                                Fecha de Fin
                              </label>
                              <Input
                                type="datetime-local"
                                value={editFormData.fecha_fin || ''}
                                onChange={(e) =>
                                  setEditFormData({ ...editFormData, fecha_fin: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Estado</label>
                            <Select
                              value={editFormData.estado || 'ACTIVO'}
                              onValueChange={(value) =>
                                setEditFormData({
                                  ...editFormData,
                                  estado: value as EstadoFestival,
                                })
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
                          <div className="flex gap-2 justify-end pt-4 border-t border-border">
                            <Button variant="outline" onClick={cancelEdit}>
                              Cancelar
                            </Button>
                            <Button onClick={() => handleSaveEdit(festival.id)}>
                              Guardar Cambios
                            </Button>
                          </div>
                        </CardContent>
                      ) : (
                        <>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl mb-1">{festival.nombre}</CardTitle>
                                <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(festival.fecha_inicio).toLocaleDateString('es-ES')} -{' '}
                                    {new Date(festival.fecha_fin).toLocaleDateString('es-ES')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {festival.nombre_recinto}
                                  </span>
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

                          <CardContent className="pb-4 space-y-4">
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

                              <Button
                                variant={isStagesOpen ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  setOpenStagesFestivalId(isStagesOpen ? null : festival.id);
                                  setOpenTicketsFestivalId(null);
                                }}
                                className="gap-2"
                              >
                                <Mic2 className="w-4 h-4" />
                                Escenarios ({festEscenarios.length})
                              </Button>

                              <Button
                                variant={isTicketsOpen ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  setOpenTicketsFestivalId(isTicketsOpen ? null : festival.id);
                                  setOpenStagesFestivalId(null);
                                }}
                                className="gap-2"
                              >
                                <TicketIcon className="w-4 h-4" />
                                Entradas ({festTiposEntrada.length})
                              </Button>

                              {festival.estado === 'ACTIVO' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(festival.id, 'FINALIZADO')}
                                  className="gap-1"
                                >
                                  <Check className="w-4 h-4" />
                                  Marcar Finalizado
                                </Button>
                              )}

                              {festival.estado !== 'CANCELADO' && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleStatusChange(festival.id, 'CANCELADO')}
                                  className="gap-1"
                                >
                                  <X className="w-4 h-4" />
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
                                Eliminar
                              </Button>
                            </div>

                            {/* Panel desplegable de Escenarios del Festival */}
                            {isStagesOpen && (
                              <div className="mt-4 pt-4 border-t border-border bg-muted/30 rounded-lg p-4 space-y-4">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                  <Mic2 className="w-4 h-4 text-accent" />
                                  Escenarios de {festival.nombre}
                                </h4>

                                <form
                                  onSubmit={(e) => handleCreateEscenario(e, festival.id)}
                                  className="flex flex-col sm:flex-row gap-2"
                                >
                                  <Input
                                    placeholder="Nombre del escenario (ej: Escenario Principal)"
                                    value={newEscenario.nombre}
                                    onChange={(e) =>
                                      setNewEscenario({ ...newEscenario, nombre: e.target.value })
                                    }
                                    required
                                  />
                                  <Input
                                    type="number"
                                    min={1}
                                    placeholder="Capacidad"
                                    className="sm:w-40"
                                    value={newEscenario.capacidad}
                                    onChange={(e) =>
                                      setNewEscenario({
                                        ...newEscenario,
                                        capacidad: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                  <Button type="submit" size="sm" className="gap-1">
                                    <Plus className="w-4 h-4" />
                                    Agregar
                                  </Button>
                                </form>

                                {festEscenarios.length === 0 ? (
                                  <p className="text-xs text-muted-foreground">
                                    No hay escenarios registrados para este festival.
                                  </p>
                                ) : (
                                  <div className="space-y-2">
                                    {festEscenarios.map((esc) => (
                                      <div
                                        key={esc.id}
                                        className="flex items-center justify-between gap-2 bg-background p-2.5 rounded border border-border text-sm"
                                      >
                                        {editingEscenarioId === esc.id ? (
                                          <div className="flex flex-1 gap-2">
                                            <Input
                                              value={editEscenarioData.nombre}
                                              onChange={(e) =>
                                                setEditEscenarioData({
                                                  ...editEscenarioData,
                                                  nombre: e.target.value,
                                                })
                                              }
                                            />
                                            <Input
                                              type="number"
                                              className="w-32"
                                              value={editEscenarioData.capacidad}
                                              onChange={(e) =>
                                                setEditEscenarioData({
                                                  ...editEscenarioData,
                                                  capacidad: e.target.value,
                                                })
                                              }
                                            />
                                            <Button
                                              size="sm"
                                              onClick={() => handleUpdateEscenario(esc.id)}
                                            >
                                              Guardar
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => setEditingEscenarioId(null)}
                                            >
                                              Cancelar
                                            </Button>
                                          </div>
                                        ) : (
                                          <>
                                            <div>
                                              <span className="font-medium">{esc.nombre}</span>
                                              <span className="text-xs text-muted-foreground ml-2">
                                                ({esc.capacidad.toLocaleString()} personas)
                                              </span>
                                            </div>
                                            <div className="flex gap-1">
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                  setEditingEscenarioId(esc.id);
                                                  setEditEscenarioData({
                                                    nombre: esc.nombre,
                                                    capacidad: String(esc.capacidad),
                                                  });
                                                }}
                                              >
                                                <Edit className="w-4 h-4" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600"
                                                onClick={() => handleDeleteEscenario(esc.id)}
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Panel desplegable de Tipos de Entrada del Festival */}
                            {isTicketsOpen && (
                              <div className="mt-4 pt-4 border-t border-border bg-muted/30 rounded-lg p-4 space-y-4">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                  <TicketIcon className="w-4 h-4 text-accent" />
                                  Tipos de Entrada de {festival.nombre}
                                </h4>

                                {/* Formulario Crear Tipo de Entrada */}
                                <form
                                  onSubmit={(e) => handleCreateTipoEntrada(e, festival.id)}
                                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2"
                                >
                                  <Input
                                    placeholder="Nombre (ej: Pase VIP Día 1)"
                                    className="lg:col-span-1"
                                    value={newTipoEntrada.nombre}
                                    onChange={(e) =>
                                      setNewTipoEntrada({
                                        ...newTipoEntrada,
                                        nombre: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                  <Input
                                    placeholder="Descripción"
                                    className="lg:col-span-2"
                                    value={newTipoEntrada.descripcion}
                                    onChange={(e) =>
                                      setNewTipoEntrada({
                                        ...newTipoEntrada,
                                        descripcion: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                  <Input
                                    type="number"
                                    min={0}
                                    placeholder="Precio CLP"
                                    value={newTipoEntrada.precio}
                                    onChange={(e) =>
                                      setNewTipoEntrada({
                                        ...newTipoEntrada,
                                        precio: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                  <Input
                                    type="number"
                                    min={1}
                                    placeholder="Stock Inicial"
                                    value={newTipoEntrada.stock}
                                    onChange={(e) =>
                                      setNewTipoEntrada({
                                        ...newTipoEntrada,
                                        stock: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                  <div className="flex">
                                    <Input
                                      type="date"
                                      value={newTipoEntrada.fecha_acceso}
                                      onChange={(e) =>
                                        setNewTipoEntrada({
                                          ...newTipoEntrada,
                                          fecha_acceso: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                    <Button type="submit" size="sm" className="flex-shrink-0">
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </form>

                                {/* Lista de Tipos de Entrada */}
                                {festTiposEntrada.length === 0 ? (
                                  <p className="text-xs text-muted-foreground">
                                    No hay tipos de entrada configurados para este festival.
                                  </p>
                                ) : (
                                  <div className="space-y-2">
                                    {festTiposEntrada.map((tipo) => (
                                      <div
                                        key={tipo.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-background p-3 rounded border border-border text-sm"
                                      >
                                        {editingTipoId === tipo.id ? (
                                          <div className="flex flex-wrap flex-1 gap-2">
                                            <Input
                                              placeholder="Nombre"
                                              className="w-40"
                                              value={editTipoData.nombre}
                                              onChange={(e) =>
                                                setEditTipoData({
                                                  ...editTipoData,
                                                  nombre: e.target.value,
                                                })
                                              }
                                            />
                                            <Input
                                              placeholder="Descripción"
                                              className="flex-1 min-w-[160px]"
                                              value={editTipoData.descripcion}
                                              onChange={(e) =>
                                                setEditTipoData({
                                                  ...editTipoData,
                                                  descripcion: e.target.value,
                                                })
                                              }
                                            />
                                            <Input
                                              type="number"
                                              placeholder="Precio"
                                              className="w-28"
                                              value={editTipoData.precio}
                                              onChange={(e) =>
                                                setEditTipoData({
                                                  ...editTipoData,
                                                  precio: e.target.value,
                                                })
                                              }
                                            />
                                            <Input
                                              type="number"
                                              placeholder="Stock Disp."
                                              className="w-24"
                                              value={editTipoData.stock_disponible}
                                              onChange={(e) =>
                                                setEditTipoData({
                                                  ...editTipoData,
                                                  stock_disponible: e.target.value,
                                                })
                                              }
                                            />
                                            <Input
                                              type="date"
                                              className="w-36"
                                              value={editTipoData.fecha_acceso}
                                              onChange={(e) =>
                                                setEditTipoData({
                                                  ...editTipoData,
                                                  fecha_acceso: e.target.value,
                                                })
                                              }
                                            />
                                            <Button
                                              size="sm"
                                              onClick={() => handleUpdateTipoEntrada(tipo.id)}
                                            >
                                              Guardar
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => setEditingTipoId(null)}
                                            >
                                              Cancelar
                                            </Button>
                                          </div>
                                        ) : (
                                          <>
                                            <div className="space-y-0.5">
                                              <div className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">
                                                  {tipo.nombre}
                                                </span>
                                                <span className="text-xs font-bold text-accent">
                                                  ${Number(tipo.precio).toLocaleString('es-CL')}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  • Stock: {tipo.stock_disponible} /{' '}
                                                  {tipo.stock_inicial}
                                                </span>
                                              </div>
                                              {tipo.descripcion && (
                                                <p className="text-xs text-muted-foreground">
                                                  {tipo.descripcion}
                                                </p>
                                              )}
                                            </div>
                                            <div className="flex gap-1 self-end sm:self-center">
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                  setEditingTipoId(tipo.id);
                                                  setEditTipoData({
                                                    nombre: tipo.nombre,
                                                    descripcion: tipo.descripcion || '',
                                                    precio: String(tipo.precio),
                                                    stock_disponible: String(
                                                      tipo.stock_disponible
                                                    ),
                                                    fecha_acceso: tipo.fecha_acceso
                                                      ? tipo.fecha_acceso.split('T')[0]
                                                      : '',
                                                  });
                                                }}
                                              >
                                                <Edit className="w-4 h-4" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600"
                                                onClick={() => handleDeleteTipoEntrada(tipo.id)}
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ==================== TAB 2: MINI CRUD DE RECINTOS ==================== */}
        {activeTab === 'RECINTOS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Nuevo Recinto</CardTitle>
                <CardDescription>Registra un recinto para futuros festivales</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRecinto} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Nombre *</label>
                    <Input
                      placeholder="ej: Parque Bicentenario"
                      value={newRecinto.nombre}
                      onChange={(e) => setNewRecinto({ ...newRecinto, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Ciudad *</label>
                    <Input
                      placeholder="ej: Santiago"
                      value={newRecinto.ciudad}
                      onChange={(e) => setNewRecinto({ ...newRecinto, ciudad: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Dirección *</label>
                    <Input
                      placeholder="ej: Av. Bicentenario 3236, Vitacura"
                      value={newRecinto.direccion}
                      onChange={(e) => setNewRecinto({ ...newRecinto, direccion: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Capacidad *</label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="ej: 50000"
                      value={newRecinto.capacidad}
                      onChange={(e) => setNewRecinto({ ...newRecinto, capacidad: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Crear Recinto
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-3">
              {recintos.map((rec) => (
                <Card key={rec.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    {editingRecintoId === rec.id ? (
                      <div className="flex flex-col sm:flex-row flex-1 gap-2">
                        <Input
                          placeholder="Nombre"
                          value={editRecintoData.nombre}
                          onChange={(e) =>
                            setEditRecintoData({ ...editRecintoData, nombre: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Ciudad"
                          className="sm:w-36"
                          value={editRecintoData.ciudad}
                          onChange={(e) =>
                            setEditRecintoData({ ...editRecintoData, ciudad: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Dirección"
                          value={editRecintoData.direccion}
                          onChange={(e) =>
                            setEditRecintoData({ ...editRecintoData, direccion: e.target.value })
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Capacidad"
                          className="sm:w-32"
                          value={editRecintoData.capacidad}
                          onChange={(e) =>
                            setEditRecintoData({ ...editRecintoData, capacidad: e.target.value })
                          }
                        />
                        <Button size="sm" onClick={() => handleUpdateRecinto(rec.id)}>
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingRecintoId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-semibold text-foreground">{rec.nombre}</h4>
                          <p className="text-xs text-muted-foreground">
                            {rec.ciudad ? `${rec.ciudad} — ` : ''}
                            {rec.direccion} • Capacidad: {rec.capacidad.toLocaleString()} personas
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingRecintoId(rec.id);
                              setEditRecintoData({
                                nombre: rec.nombre,
                                ciudad: rec.ciudad || '',
                                direccion: rec.direccion,
                                capacidad: String(rec.capacidad),
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteRecinto(rec.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: MINI CRUD DE ARTISTAS ==================== */}
        {activeTab === 'ARTISTAS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Nuevo Artista</CardTitle>
                <CardDescription>Agrega un artista o banda al catálogo</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateArtista} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Nombre del Artista *</label>
                    <Input
                      placeholder="ej: Los Bunkers"
                      value={newArtista.nombre}
                      onChange={(e) => setNewArtista({ ...newArtista, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Género Musical *</label>
                    <Input
                      placeholder="ej: Rock Alternativo"
                      value={newArtista.genero}
                      onChange={(e) => setNewArtista({ ...newArtista, genero: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">País de Origen *</label>
                    <Input
                      placeholder="ej: Chile"
                      value={newArtista.pais}
                      onChange={(e) => setNewArtista({ ...newArtista, pais: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Registrar Artista
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-3">
              {artistas.map((art) => (
                <Card key={art.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    {editingArtistaId === art.id ? (
                      <div className="flex flex-col sm:flex-row flex-1 gap-2">
                        <Input
                          value={editArtistaData.nombre}
                          onChange={(e) =>
                            setEditArtistaData({ ...editArtistaData, nombre: e.target.value })
                          }
                        />
                        <Input
                          value={editArtistaData.genero}
                          onChange={(e) =>
                            setEditArtistaData({ ...editArtistaData, genero: e.target.value })
                          }
                        />
                        <Input
                          className="sm:w-36"
                          value={editArtistaData.pais}
                          onChange={(e) =>
                            setEditArtistaData({ ...editArtistaData, pais: e.target.value })
                          }
                        />
                        <Button size="sm" onClick={() => handleUpdateArtista(art.id)}>
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingArtistaId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-semibold text-foreground">{art.nombre}</h4>
                          <p className="text-xs text-muted-foreground">
                            {art.genero} • {art.pais}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingArtistaId(art.id);
                              setEditArtistaData({
                                nombre: art.nombre,
                                genero: art.genero,
                                pais: art.pais,
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteArtista(art.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
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

export default ProducerPanel;