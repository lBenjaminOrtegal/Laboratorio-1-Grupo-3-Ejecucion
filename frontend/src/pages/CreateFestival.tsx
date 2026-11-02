import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Music, AlertCircle, CheckCircle } from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';
import type { Recinto } from '@/interfaces/recinto.interface';
import type { CreateFestivalDTO } from '@/interfaces/festival.interface';
import recintoService from '@/services/recinto.service';

function CreateFestival() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const getRecintos = async () => {
      try {
        setLoading(true);
        const response = await recintoService.getAll();
        setRecintos(response.data);
      } catch (error) {
        console.error("Error al cargar los recintos:", error);
        setRecintos([]);
      } finally {
        setLoading(false);
      }
    };

    const [formData, setFormData] = useState<CreateFestivalDTO>({
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'ACTIVO',
    id_recinto: 0,
    id_productor: Number(user?.id),
  });

  useEffect(() => {
    getRecintos();
  }, []);

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
  };

  const validateForm = (): string | null => {
    if (!formData.nombre.trim()) {
      return 'El nombre del festival es obligatorio';
    }

    if (formData.nombre.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.fecha_inicio) {
      return 'La fecha de inicio es obligatoria';
    }

    if (!formData.fecha_fin) {
      return 'La fecha de fin es obligatoria';
    }

    if (!formData.id_recinto) {
      return 'Debes seleccionar un recinto';
    }

    const fechaInicio = new Date(formData.fecha_inicio);
    const fechaFin = new Date(formData.fecha_fin);

    if (fechaInicio >= fechaFin) {
      return 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      if (!user?.id) {
        throw new Error('No se pudo obtener tu información de usuario');
      }

      const festivalData = {
        nombre: formData.nombre.trim(),
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        id_recinto: Number(formData.id_recinto),
        id_productor: user.id,
        estado: 'ACTIVO',
      };

      await festivalService.create(festivalData);
      setSuccess(true);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/festivals');
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear el festival';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full bg-background min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">¡Festival Creado!</h2>
              <p className="text-muted-foreground text-center mb-6">
                Tu festival ha sido creado exitosamente. Redirigiendo a festivales...
              </p>
            </CardContent>
          </Card>
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
                <Music className="w-8 h-8 text-accent" />
                Crear Nuevo Festival
              </h1>
              <p className="text-muted-foreground mt-1">
                Configura los detalles básicos de tu festival
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${currentStep >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className="flex-1 h-1 bg-muted rounded-full"></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${currentStep >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentStep === 1 ? 'Información Básica' : 'Escenarios'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Festival</CardTitle>
                  <CardDescription>
                    Ingresa los detalles básicos de tu festival
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  {/* Festival Name */}
                  <div className="space-y-2">
                    <label htmlFor="nombre" className="block text-sm font-medium text-foreground">
                      Nombre del Festival *
                    </label>
                    <Input
                      id="nombre"
                      name="nombre"
                      placeholder="ej: Santiago Sound Fest 2026"
                      value={formData.nombre}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Mínimo 3 caracteres
                    </p>
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label htmlFor="fecha_inicio" className="block text-sm font-medium text-foreground">
                      Fecha de Inicio *
                    </label>
                    <Input
                      id="fecha_inicio"
                      name="fecha_inicio"
                      type="datetime-local"
                      value={formData.fecha_inicio}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <label htmlFor="fecha_fin" className="block text-sm font-medium text-foreground">
                      Fecha de Fin *
                    </label>
                    <Input
                      id="fecha_fin"
                      name="fecha_fin"
                      type="datetime-local"
                      value={formData.fecha_fin}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Recinto Select */}
                  <div className="space-y-2">
                    <label htmlFor="id_recinto" className="block text-sm font-medium text-foreground">
                      Recinto *
                    </label>
                    <Select onValueChange={(value) => handleSelectChange('id_recinto', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un recinto" />
                      </SelectTrigger>
                      <SelectContent>
                        {recintos.map((recinto) => (
                          <SelectItem key={recinto.id} value={String(recinto.id)}>
                            {recinto.nombre} - {recinto.capacidad.toLocaleString()} personas
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Next Button */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/festivals')}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const validationError = validateForm();
                    if (validationError) {
                      setError(validationError);
                    } else {
                      setCurrentStep(2);
                      setError(null);
                    }
                  }}
                  disabled={loading}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Staging */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Festival</CardTitle>
                  <CardDescription>
                    Revisa los detalles antes de crear el festival
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Nombre:</span>
                      <span className="font-semibold text-foreground">{formData.nombre}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Desde:</span>
                      <span className="font-semibold text-foreground">
                        {new Date(formData.fecha_inicio).toLocaleDateString('es-ES')}
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Hasta:</span>
                      <span className="font-semibold text-foreground">
                        {new Date(formData.fecha_fin).toLocaleDateString('es-ES')}
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Recinto:</span>
                      <span className="font-semibold text-foreground">
                        {recintos.find((r) => r.id === Number(formData.id_recinto))?.nombre}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Estado:</span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        ACTIVO
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mt-6">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Tip:</strong> Después de crear el festival, podrás agregar escenarios y el line-up con presentaciones de artistas.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Buttons */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  disabled={loading}
                >
                  Volver
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? 'Creando...' : (
                    <>
                      <Plus className="w-4 h-4" />
                      Crear Festival
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateFestival;
