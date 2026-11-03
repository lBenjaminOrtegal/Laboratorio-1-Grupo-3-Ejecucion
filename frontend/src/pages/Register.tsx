import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Music, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import authService from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = (): string | null => {
    // Validar campos obligatorios
    if (!formData.nombre.trim() || !formData.apellido.trim() || 
        !formData.correo.trim() || !formData.contrasena) {
      return 'Por favor, completa todos los campos';
    }

    // Validar nombres
    if (formData.nombre.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }

    if (formData.apellido.length < 2) {
      return 'El apellido debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      return 'Por favor, ingresa un correo válido';
    }

    // Validar contraseña
    if (formData.contrasena.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar coincidencia de contraseñas
    if (formData.contrasena !== formData.confirmarContrasena) {
      return 'Las contraseñas no coinciden';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar formulario
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      // Registrar usuario
      await authService.register({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo: formData.correo.trim().toLowerCase(),
        contrasena: formData.contrasena,
      });

      // Ahora iniciar sesión automáticamente
      const loginResponse = await authService.login({
        correo: formData.correo.trim().toLowerCase(),
        contrasena: formData.contrasena,
      });

      // Actualizar contexto con los datos del usuario
      if (loginResponse.usuario) {
        loginContext({
          id: loginResponse.usuario.id,
          nombre: loginResponse.usuario.nombre,
          apellido: loginResponse.usuario.apellido,
          correo: loginResponse.usuario.correo,
          rol: loginResponse.usuario.rol,
          credito_acumulado: loginResponse.usuario.credito_acumulado,
          activo: loginResponse.usuario.activo,
        });
      }

      setSuccess(true);

      // Redirigir a home después de 1 segundo
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">¡Registro Exitoso!</h2>
            <p className="text-muted-foreground text-center mb-6">
              Tu cuenta ha sido creada exitosamente. Redirigiendo al home...
            </p>
            <Link to="/">
              <Button>Ir a Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <Music className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">CedoFest</h1>
          <p className="text-muted-foreground">Crea tu cuenta</p>
        </div>

        {/* Form Card */}
        <Card className='shadow'>
          <CardHeader>
            <CardTitle>Registrarse</CardTitle>
            <CardDescription>
              Crea una cuenta para acceder a los festivales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Nombre Field */}
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-foreground">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Apellido Field */}
              <div className="space-y-2">
                <label htmlFor="apellido" className="block text-sm font-medium text-foreground">
                  Apellido
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="apellido"
                    name="apellido"
                    type="text"
                    placeholder="Pérez"
                    value={formData.apellido}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="correo" className="block text-sm font-medium text-foreground">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.correo}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="contrasena" className="block text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="contrasena"
                    name="contrasena"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.contrasena}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-foreground">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="confirmarContrasena"
                    name="confirmarContrasena"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                    disabled={loading}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-accent hover:text-accent/80">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
