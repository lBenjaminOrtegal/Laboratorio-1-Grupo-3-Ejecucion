import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Music,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Loader,
  CheckCircle,
  Plus,
  X,
  Clock,
} from "lucide-react";
import presentacionService from "../services/presentacion.service";
import festivalService from "../services/festival.service";
import { useAuth } from "@/contexts/AuthContext";
import type { Presentacion, UpdatePresentacionDTO, EstadoPresentacion } from "../interfaces/presentacion.interface";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import type { Festival } from "@/interfaces/festival.interface";

function ManagePresentaciones() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<UpdatePresentacionDTO | null>(null);
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([]);
  const [festivales, setFestivales] = useState<Festival[]>([]);
  const [festivalId, setFestivalId] = useState<number | null>(null);
  const [festivalesLoading, setFestivalesLoading] = useState(true);

  const getFestivalesProductor = async () => {
    try {
      setFestivalesLoading(true);
      setError(null);
      const response = await festivalService.getAll();
      const festividadesProductor = response.data.filter(
        (f: Festival) => f.id_productor === user?.id
      );
      setFestivales(festividadesProductor);
      if (festividadesProductor.length > 0) {
        setFestivalId(festividadesProductor[0].id);
      }
    } catch (err) {
      console.error("Error al cargar festivales:", err);
      setError("Error al cargar festivales");
      setFestivales([]);
    } finally {
      setFestivalesLoading(false);
    }
  };

  const getPresentacionesFestival = async (idFestival: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await presentacionService.getAll();
      const presentacionesFestival = response.filter(
        (p: Presentacion) => Number(p.id_festival) === idFestival
      );
      setPresentaciones(presentacionesFestival);
    } catch (err) {
      console.error("Error al cargar presentaciones:", err);
      setError("Error al cargar presentaciones");
      setPresentaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFestivalesProductor();
  }, [user?.id]);

  useEffect(() => {
    if (festivalId) {
      getPresentacionesFestival(festivalId);
    }
  }, [festivalId]);

  const handleFestivalChange = (value: string) => {
    setFestivalId(Number(value));
  };

  // Iniciar edición
  const startEdit = (presentacion: Presentacion) => {
    const convertToDateTimeLocal = (date: string | Date): string => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setEditingId(presentacion.id_presentacion);
    setEditFormData({
      fecha_inicio: convertToDateTimeLocal(presentacion.fecha_inicio),
      fecha_fin: convertToDateTimeLocal(presentacion.fecha_fin),
      estado: presentacion.estado,
    });
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  // Guardar cambios
  const handleSaveEdit = async (presentacionId: number) => {
    if (!editFormData) return;

    try {
      setLoading(true);
      setError(null);

      if (editFormData.fecha_inicio && editFormData.fecha_fin) {
        const inicio = new Date(editFormData.fecha_inicio);
        const fin = new Date(editFormData.fecha_fin);
        if (inicio >= fin) {
          throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
        }
      }

      await presentacionService.update(presentacionId, editFormData);

      setSuccessMessage("Presentación actualizada correctamente");
      setTimeout(() => setSuccessMessage(null), 3000);

      if (festivalId) {
        getPresentacionesFestival(festivalId);
      }
      cancelEdit();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al actualizar presentación";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idPresentacion: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta presentación?")) {
      return;
    }

    try {
      setDeletingId(idPresentacion);
      setError(null);
      await presentacionService.delete(idPresentacion);

      setSuccessMessage("Presentación eliminada correctamente");
      setTimeout(() => setSuccessMessage(null), 3000);

      setPresentaciones(
        presentaciones.filter((p) => p.id_presentacion !== idPresentacion)
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar presentación";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = async (idPresentacion: number) => {
    if (
      !confirm(
        "¿Estás seguro de que deseas cancelar esta presentación? Se notificará a todos los asistentes."
      )
    ) {
      return;
    }

    try {
      setCancelingId(idPresentacion);
      setError(null);
      await presentacionService.cancelar(idPresentacion);

      setSuccessMessage("Presentación cancelada correctamente. Se ha notificado a los asistentes.");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Actualizar estado local
      setPresentaciones(
        presentaciones.map((p) =>
          p.id_presentacion === idPresentacion
            ? { ...p, estado: "CANCELADA" }
            : p
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cancelar presentación";
      setError(message);
    } finally {
      setCancelingId(null);
    }
  };

  const formatTime = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "PROGRAMADA":
        return "bg-blue-100 text-blue-800";
      case "CANCELADA":
        return "bg-red-100 text-red-800";
      case "FINALIZADA":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const selectedFestival = festivales.find((f) => f.id === festivalId);

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-2">
                <Music className="w-8 h-8 text-accent" />
                Gestionar Presentaciones
              </h1>
              <p className="text-muted-foreground mt-1">
                Administra las presentaciones de tus festivales
              </p>
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={() => navigate("/create-performance")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Presentación
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

        {/* Festival Selector */}
        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Seleccionar Festival</CardTitle>
            <CardDescription>
              Elige un festival para ver y gestionar sus presentaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="festival"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Festival
                </label>
                <Select
                  value={String(festivalId || "")}
                  onValueChange={handleFestivalChange}
                >
                  <SelectTrigger id="festival">
                    <SelectValue placeholder="Selecciona un festival" />
                  </SelectTrigger>
                  <SelectContent>
                    {festivalesLoading ? (
                      <SelectItem value="loading" disabled>
                        Cargando festivales...
                      </SelectItem>
                    ) : festivales.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        No tienes festivales creados
                      </SelectItem>
                    ) : (
                      festivales.map((festival) => (
                        <SelectItem key={festival.id} value={String(festival.id)}>
                          {festival.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && !editingId && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 text-accent animate-spin" />
              <p className="text-muted-foreground">Cargando presentaciones...</p>
            </div>
          </div>
        )}

        {/* Presentations List */}
        {!loading && presentaciones.length > 0 && (
          <div className="space-y-4">
            {presentaciones.map((presentacion) => (
              <Card
                key={presentacion.id_presentacion}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {editingId === presentacion.id_presentacion && editFormData ? (
                  // Edit Mode
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Fecha de Inicio
                          </label>
                          <Input
                            type="datetime-local"
                            value={editFormData.fecha_inicio || ""}
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
                            value={editFormData.fecha_fin || ""}
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
                          value={editFormData.estado || "PROGRAMADA"}
                          onValueChange={(value) =>
                            setEditFormData({
                              ...editFormData,
                              estado: value as EstadoPresentacion,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PROGRAMADA">Programada</SelectItem>
                            <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                            <SelectItem value="CANCELADA">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-4 border-t border-border">
                      <Button variant="outline" onClick={cancelEdit} disabled={loading}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={() =>
                          handleSaveEdit(presentacion.id_presentacion)
                        }
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                      </Button>
                    </div>
                  </CardContent>
                ) : (
                  // View Mode
                  <>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">
                            {presentacion.artista_nombre}
                          </CardTitle>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {formatDate(presentacion.fecha_inicio)}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {presentacion.escenario_nombre}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getEstadoColor(
                            presentacion.estado
                          )}`}
                        >
                          {presentacion.estado}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <p>
                          <span className="font-semibold">Género:</span>{" "}
                          {presentacion.artista_genero}
                        </p>
                        <p>
                          <span className="font-semibold">Festival:</span>{" "}
                          {presentacion.festival_nombre}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            <span className="font-semibold">Horario:</span>{" "}
                            {formatTime(presentacion.fecha_inicio)} -{" "}
                            {formatTime(presentacion.fecha_fin)}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(presentacion)}
                          className="gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </Button>

                        {presentacion.estado === "PROGRAMADA" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleCancel(presentacion.id_presentacion)
                            }
                            disabled={
                              cancelingId === presentacion.id_presentacion
                            }
                            className="gap-2"
                          >
                            <X className="w-4 h-4" />
                            {cancelingId === presentacion.id_presentacion
                              ? "Cancelando..."
                              : "Cancelar"}
                          </Button>
                        )}

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDelete(presentacion.id_presentacion)
                          }
                          disabled={deletingId === presentacion.id_presentacion}
                          className="gap-2 ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === presentacion.id_presentacion
                            ? "Eliminando..."
                            : "Eliminar"}
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
        {!loading && presentaciones.length === 0 && !error && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Sin presentaciones
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                {selectedFestival
                  ? `${selectedFestival.nombre} no tiene presentaciones creadas.`
                  : "Selecciona un festival para ver sus presentaciones."}
              </p>
              <Button
                onClick={() => navigate("/create-presentacion")}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Primera Presentación
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ManagePresentaciones;
