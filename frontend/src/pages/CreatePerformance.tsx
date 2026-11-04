import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, AlertCircle, CheckCircle, Loader, Calendar, Clock, Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import festivalService from '@/services/festival.service';
import presentacionService from '@/services/presentacion.service';
import escenarioService from '@/services/escenario.service';
import artistaService from '@/services/artista.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Festival } from '@/interfaces/festival.interface';
import type { CreatePresentacionDTO, EstadoPresentacion } from '@/interfaces/presentacion.interface';
import type { Escenario } from '@/interfaces/escenario.interface';
import type { Artista } from '@/interfaces/artista.interface';

interface FormState {
  id_festival: string;
  id_escenario: string;
  id_artista: string;
  fecha_inicio: string;
  fecha_fin: string;
}

function CreatePresentacion() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [escenarios, setEscenarios] = useState<Escenario[]>([]);
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [minDate, setMinDate] = useState<string>('');
  const [maxDate, setMaxDate] = useState<string>('');

  const [formData, setFormData] = useState<FormState>({
    id_festival: '',
    id_escenario: '',
    id_artista: '',
    fecha_inicio: '',
    fecha_fin: '',
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar festivales del productor
        const festResponse = await festivalService.getAll();
        // festivalService retorna el objeto HTTP completo, hay que acceder a .data
        const festData = festResponse.data || [];

        // Filtrar solo festivales del productor actual y que estén activos
        const myFestivals = festData.filter(
          (f: Festival) => f.id_productor === user?.id && f.estado === 'ACTIVO'
        );
        setFestivals(myFestivals);

        // Cargar artistas
        // artistaService retorna directamente response.data (el array)
        const artistResponse = await artistaService.getAll();
        const artistData = Array.isArray(artistResponse) ? artistResponse : [];
        setArtistas(artistData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar datos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Cargar escenarios cuando se selecciona festival
  useEffect(() => {
    const loadEscenarios = async () => {
      if (!formData.id_festival) {
        setEscenarios([]);
        setMinDate('');
        setMaxDate('');
        return;
      }

      try {
        // Encontrar festival seleccionado
        const selectedFestival = festivals.find(f => f.id === Number(formData.id_festival));
        
        if (selectedFestival) {
          // Convertir fechas a formato datetime-local
          const fechaInicio = new Date(selectedFestival.fecha_inicio);
          const fechaFin = new Date(selectedFestival.fecha_fin);
          
          // Formato para datetime-local: YYYY-MM-DDTHH:mm
          const minDateStr = fechaInicio.toISOString().slice(0, 16);
          const maxDateStr = fechaFin.toISOString().slice(0, 16);
          
          setMinDate(minDateStr);
          setMaxDate(maxDateStr);
          
          // Limpiar fechas previas si cambia festival
          setFormData(prev => ({
            ...prev,
            fecha_inicio: '',
            fecha_fin: ''
          }));
        }

        // escenarioService retorna directamente response.data (el array)
        const escResponse = await escenarioService.getAll();
        const escData = Array.isArray(escResponse) ? escResponse : [];

        const festivalEscenarios = escData.filter(
          (e: Escenario) => Number(e.id_festival) === Number(formData.id_festival)
        );
        setEscenarios(festivalEscenarios);
      } catch (err) {
        console.error('Error loading stages:', err);
        setError('Error al cargar escenarios.');
      }
    };

    loadEscenarios();
  }, [formData.id_festival, festivals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.id_festival) {
      return 'Debes seleccionar un festival';
    }

    if (!formData.id_escenario) {
      return 'Debes seleccionar un escenario';
    }

    if (!formData.id_artista) {
      return 'Debes seleccionar un artista';
    }

    if (!formData.fecha_inicio) {
      return 'La fecha y hora de inicio es obligatoria';
    }

    if (!formData.fecha_fin) {
      return 'La fecha y hora de fin es obligatoria';
    }

    const inicio = new Date(formData.fecha_inicio);
    const fin = new Date(formData.fecha_fin);

    if (fin <= inicio) {
      return 'La fecha de fin debe ser posterior a la de inicio';
    }

    // Validar que no sea mayor a 12 horas
    const diffHours = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
    if (diffHours > 12) {
      return 'La presentación no puede durar más de 12 horas';
    }

    // Validar que esté dentro de las fechas del festival
    const festival = festivals.find((f: Festival) => f.id === Number(formData.id_festival));
    if (festival) {
      const festInicio = new Date(festival.fecha_inicio);
      const festFin = new Date(festival.fecha_fin);
      const maxFin = new Date(festFin.getTime() + 24 * 60 * 60 * 1000);
      
      if (inicio < festInicio || fin > maxFin) {
        return 'La presentación debe estar dentro de las fechas del festival';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      // Crear objeto que cumpla con CreatePresentacionDTO
      const presentacionData: CreatePresentacionDTO = {
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        id_artista: Number(formData.id_artista),
        id_escenario: Number(formData.id_escenario),
        estado: 'PROGRAMADA' as EstadoPresentacion,
      };

      await presentacionService.create(presentacionData);

      setSuccess(true);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/festivals');
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear presentación';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full bg-background min-h-screen flex items-center">
        <div className="max-w-md mx-auto w-full">
          <Card className="text-center">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">¡Presentación Creada!</h2>
              <p className="text-muted-foreground">
                Tu presentación ha sido programada exitosamente. Redirigiendo...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-2">
                <Mic2 className="w-8 h-8 text-accent" />
                Crear Presentación
              </h1>
              <p className="text-muted-foreground mt-1">
                Agrega un artista a tu festival
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Presentación</CardTitle>
              <CardDescription>
                Completa los datos para programar una nueva presentación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Festival Select */}
              <div className="space-y-2">
                <label htmlFor="id_festival" className="block text-sm font-medium text-foreground">
                  Festival * <span className="text-xs text-muted-foreground">(Solo activos)</span>
                </label>
                <Select
                  value={formData.id_festival}
                  onValueChange={(value) => handleSelectChange('id_festival', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un festival" />
                  </SelectTrigger>
                  <SelectContent>
                    {festivals.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No tienes festivales activos
                      </div>
                    ) : (
                      festivals.map((festival: Festival) => (
                        <SelectItem key={festival.id} value={String(festival.id)}>
                          {festival.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Escenario Select */}
              <div className="space-y-2">
                <label htmlFor="id_escenario" className="block text-sm font-medium text-foreground">
                  Escenario *
                </label>
                <Select
                  value={formData.id_escenario}
                  onValueChange={(value) => handleSelectChange('id_escenario', value)}
                  disabled={!formData.id_festival}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un escenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {escenarios.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        {formData.id_festival
                          ? 'No hay escenarios disponibles'
                          : 'Selecciona un festival primero'}
                      </div>
                    ) : (
                      escenarios.map((escenario: Escenario) => (
                        <SelectItem key={escenario.id} value={String(escenario.id)}>
                          {escenario.nombre} ({escenario.capacidad} personas)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Artista Select */}
              <div className="space-y-2">
                <label htmlFor="id_artista" className="block text-sm font-medium text-foreground">
                  Artista *
                </label>
                <Select
                  value={formData.id_artista}
                  onValueChange={(value) => handleSelectChange('id_artista', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un artista" />
                  </SelectTrigger>
                  <SelectContent>
                    {artistas.map((artista: Artista) => (
                      <SelectItem key={artista.id} value={String(artista.id)}>
                        {artista.nombre} ({artista.genero})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha Inicio */}
              <div className="space-y-2">
                <label htmlFor="fecha_inicio" className="block text-sm font-medium text-foreground">
                  Fecha y Hora de Inicio *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="fecha_inicio"
                    name="fecha_inicio"
                    type="datetime-local"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    disabled={submitting || !formData.id_festival}
                    min={minDate}
                    max={maxDate}
                    className="pl-10"
                    required
                  />
                </div>
                {formData.id_festival && (
                  <p className="text-xs text-muted-foreground">
                    Rango permitido: {minDate ? new Date(minDate).toLocaleDateString('es-ES') : 'Selecciona festival'}
                  </p>
                )}
              </div>

              {/* Fecha Fin */}
              <div className="space-y-2">
                <label htmlFor="fecha_fin" className="block text-sm font-medium text-foreground">
                  Fecha y Hora de Fin *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="fecha_fin"
                    name="fecha_fin"
                    type="datetime-local"
                    value={formData.fecha_fin}
                    onChange={handleChange}
                    disabled={submitting || !formData.id_festival}
                    min={minDate}
                    max={maxDate}
                    className="pl-10"
                    required
                  />
                </div>
                {formData.id_festival && (
                  <p className="text-xs text-muted-foreground">
                    Rango permitido: hasta {maxDate ? new Date(maxDate).toLocaleDateString('es-ES') : 'Selecciona festival'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || festivals.length === 0}
              className="gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Programando...
                </>
              ) : (
                <>
                  <Music className="w-4 h-4" />
                  Programar Presentación
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePresentacion;
