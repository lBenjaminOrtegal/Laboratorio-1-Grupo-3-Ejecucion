import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-background min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
          {/* 404 Number */}
          <div className="space-y-4">
            <div className="text-9xl sm:text-[150px] font-black bg-gradient-to-r from-accent to-accent/50 bg-clip-text text-transparent">
              404
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              ¡Página No Encontrada!
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Lo sentimos, la página que buscas no existe o ha sido movida. Parece que la música se detuvo aquí.
            </p>
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

export default NotFound;
