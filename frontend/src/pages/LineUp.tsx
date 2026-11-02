import { useEffect, useState } from "react";
import { Calendar, Search, AlertCircle, Music } from "lucide-react";
import presentacionService from "../services/presentacion.service";
import festivalService from "../services/festival.service";
import type {
  Presentacion,
  PresentacionesEscenario,
} from "../interfaces/presentacion.interface";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface Festival {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

function LineUp() {
  const [loading, setLoading] = useState(true);
  const [lineUp, setLineUp] = useState<PresentacionesEscenario[]>([]);
  const [fecha, setFecha] = useState<string>("");
  const [festivalId, setFestivalId] = useState<number>(1);
  const [festivales, setFestivales] = useState<Festival[]>([]);
  const [festivalesLoading, setFestivalesLoading] = useState(true);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const getLineUp = async (id_festival: number, selectedDate: string) => {
    try {
      setLoading(true);
      const dateToUse = selectedDate || getTodayDate();
      const response = await presentacionService.getLineUp(id_festival, dateToUse);
      setLineUp(response.data);
    } catch (error) {
      console.error("Error al cargar line-up:", error);
      setLineUp([]);
    } finally {
      setLoading(false);
    }
  };

  const getFestivales = async () => {
    try {
      setFestivalesLoading(true);
      const response = await festivalService.getAll();
      setFestivales(response.data);
      if (response.data && response.data.length > 0) {
        setFestivalId(response.data[0].id);
      }
    } catch (error) {
      console.error("Error al cargar festivales:", error);
      setFestivales([]);
    } finally {
      setFestivalesLoading(false);
    }
  };

  const handleSearch = () => {
    const dateToSearch = fecha || getTodayDate();
    getLineUp(festivalId, dateToSearch);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(e.target.value);
  };

  const handleFestivalChange = (value: string) => {
    const newFestivalId = Number(value);
    setFestivalId(newFestivalId);
    const dateToSearch = fecha || getTodayDate();
    getLineUp(newFestivalId, dateToSearch);
  };

  useEffect(() => {
    getFestivales();
  }, []);

  useEffect(() => {
    if (festivalId && festivales.length > 0) {
      getLineUp(festivalId, getTodayDate());
      setFecha(getTodayDate());
    }
  }, [festivales]);

  const formatTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStateColor = (estado: string) => {
    switch (estado) {
      case "CONFIRMADA":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "CANCELADA":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "POSPUESTA":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Line-Up</h1>
          </div>
          <p className="text-muted-foreground">
            Consulta el calendario de presentaciones por día y escenario
          </p>
        </div>

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Buscar Presentaciones</CardTitle>
            <CardDescription>
              Selecciona un festival y una fecha para ver las presentaciones disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="festival" className="block text-sm font-medium text-foreground mb-2">
                  Festival
                </label>
                <Select value={String(festivalId)} onValueChange={handleFestivalChange}>
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
                        No hay festivales disponibles
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

              <div className="flex-1">
                <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                  Seleccionar fecha
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="date"
                    type="date"
                    value={fecha}
                    onChange={handleDateChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full sm:w-auto gap-2" variant="outline">
                  <Search className="w-4 h-4" />
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        )}

        {!loading && lineUp.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No hay presentaciones
              </h3>
              <p className="text-muted-foreground text-center">
                No encontramos presentaciones para la fecha y festival seleccionados.
                <br />
                Intenta con otra fecha.
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && lineUp.length > 0 && (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Mostrando presentaciones para: <strong>{formatDate(fecha || getTodayDate())}</strong>
            </div>

            {lineUp.map((escenario) => (
              <Card key={escenario.id_escenario} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-accent" />
                    {escenario.nombre_escenario}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {escenario.presentaciones.map((presentacion: Presentacion) => (
                      <div
                        key={presentacion.id_presentacion}
                        className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {presentacion.nombre_artista}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {presentacion.genero_artista}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatTime(presentacion.fecha_inicio)} -{" "}
                            {formatTime(presentacion.fecha_fin)}
                          </span>
                        </div>

                        <div className="flex gap-2 mb-4">
                          <Badge
                            variant="outline"
                            className={`${getStateColor(presentacion.estado)} border-0`}
                          >
                            {presentacion.estado}
                          </Badge>
                        </div>

                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => {
                            console.log("Ver presentación:", presentacion.id_presentacion);
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LineUp;