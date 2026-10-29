import { useNavigate } from "react-router-dom";
import { ArrowRight, Music, Users, Ticket, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
                  Vive la
                  <span className="text-accent"> Experiencia</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Descubre los mejores festivales de música, artistas increíbles y momentos inolvidables.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => navigate("/line-up")}
                >
                  Ver Line-Up
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigate("/festivals")}
                >
                  Explorar Festivales
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <p className="text-3xl font-bold text-accent">50+</p>
                  <p className="text-sm text-muted-foreground">Artistas</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">100+</p>
                  <p className="text-sm text-muted-foreground">Presentaciones</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">5000+</p>
                  <p className="text-sm text-muted-foreground">Asistentes</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-full aspect-square bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center">
                <Music className="w-48 h-48 text-accent/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">¿Por qué elegir CedoFest?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La plataforma más completa para descubrir, explorar y disfrutar de los mejores festivales de música
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Artistas Increíbles</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Descubre presentaciones de los artistas más destacados de la industria musical.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Fácil Planificación</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Consulta el line-up completo, horarios y detalles de cada presentación al instante.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Ticket className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Compra Segura</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Adquiere tus entradas de forma segura y recibe confirmación instantánea.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Comunidad Activa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Conecta con otros fanáticos y vive la experiencia juntos.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <ArrowRight className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Acceso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Interfaz intuitiva y rápida para encontrar exactamente lo que buscas.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Notificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Recibe alertas sobre nuevos festivales y presentaciones que te interesan.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-accent/10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">
            ¿Listo para descubrir los próximos eventos?
          </h2>
          <p className="text-lg text-muted-foreground">
            Explora nuestro catálogo completo de festivales y artistas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate("/line-up")}
            >
              Ver Presentaciones
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/festivals")}
            >
              Todos los Festivales
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              question: "¿Cómo compro entradas?",
              answer:
                "Navega a la sección de Line-Up, selecciona el festival y la fecha que deseas, y elige las presentaciones que quieres. Luego procede con la compra segura.",
            },
            {
              question: "¿Puedo cambiar mis entradas?",
              answer:
                "Sí, puedes cambiar o canjear tus entradas dentro de los términos y condiciones especificados para cada festival.",
            },
            {
              question: "¿Hay descuentos para grupos?",
              answer:
                "Consulta con nuestro equipo de soporte para información sobre descuentos especiales para grupos grandes.",
            },
            {
              question: "¿Cuándo se publican los horarios?",
              answer:
                "Los horarios se publican típicamente 2-4 semanas antes del evento. Recibirás una notificación cuando estén disponibles.",
            },
          ].map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Promo */}
      <div className="border-t border-border bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            🎵 CedoFest - Tu plataforma de festivales favorita
          </h3>
          <p className="text-muted-foreground">
            © 2026 CedoFest. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
