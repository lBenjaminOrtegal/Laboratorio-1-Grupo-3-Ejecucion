import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-background min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
          {/* Lock Icon */}
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
            <Lock className="w-12 h-12 text-red-600" />
          </div>

          {/* Error Text */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Acceso Denegado
            </h1>
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground">
                No tienes permiso para acceder a esta página.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Ir a Home
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver Atrás
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
