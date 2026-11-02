import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Music, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import authService from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // Limpiar error al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar campos
      if (!formData.correo || !formData.contrasena) {
        throw new Error('Por favor, completa todos los campos');
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.correo)) {
        throw new Error('Por favor, ingresa un correo válido');
      }

      // Realizar login
      const response = await authService.login({
        correo: formData.correo,
        contrasena: formData.contrasena,
      });

      // Actualizar contexto con los datos del usuario
      if (response.usuario) {
        loginContext({
          id: response.usuario.id,
          nombre: response.usuario.nombre,
          apellido: response.usuario.apellido,
          correo: response.usuario.correo,
          rol: response.usuario.rol,
          credito_acumulado: response.usuario.credito_acumulado,
          activo: response.usuario.activo,
        });
      }

      // Redirigir a home o dashboard
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-muted-foreground">Ingresa a tu cuenta</p>
        </div>

        {/* Form Card */}
        <Card className='shadow-md'>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Inicia sesión para acceder a tus tickets y festiva les
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
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Register Link */}
        <div className="text-center space-y-3">
          <div className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-accent hover:text-accent/80">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
