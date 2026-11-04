import { useLocation, Link } from "react-router-dom";
import { Menu, X, Music, Home, LogOut, User, Plus, Pencil, HandMetalIcon, Ticket, ShoppingCart, Mic2, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import notificacionService from "@/services/notificacion.service";
import type { Notificacion } from "@/interfaces/notificacion.interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function NavBarComponent() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loadingNotificaciones, setLoadingNotificaciones] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Cargar notificaciones cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user?.rol === 'ASISTENTE') {
      loadNotificaciones();
    }
  }, [isAuthenticated, user]);

  const loadNotificaciones = async () => {
    try {
      setLoadingNotificaciones(true);
      const data = await notificacionService.getMyNotifications();
      console.log('Raw data from API:', data);
      
      // Manejar diferentes formatos de respuesta
      let notiList: Notificacion[] = [];
      
      if (Array.isArray(data)) {
        notiList = data;
      } else if (data?.data && Array.isArray(data.data)) {
        notiList = data.data;
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Si es un objeto único (no array), convertirlo a array
        notiList = [data];
      }
      
      console.log('Processed notificaciones:', notiList);
      setNotificaciones(notiList);
    } catch (error) {
      console.error('Error loading notificaciones:', error);
      setNotificaciones([]);
    } finally {
      setLoadingNotificaciones(false);
    }
  };

  const formatearFecha = (fecha: string | Date) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearSaldo = (saldo: number | string) => {
    return Number(saldo).toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  const navItems = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/festivals", label: "Festivales", icon: HandMetalIcon },
  ];

  const handleLogout = () => {
    logout();
    // Redirigir a home
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-8">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Music className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="hidden sm:inline font-bold text-lg text-foreground">
              CedoFest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "outline"}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {isAuthenticated && user ? (
              <>
                {/* Notificaciones para asistentes */}
                {user.rol === 'ASISTENTE' && (
                  <div className="flex items-center gap-4 pr-4 border-r border-border">
                    {/* Saldo abonado */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Saldo:</span>
                      <span className="font-semibold text-accent">
                        {formatearSaldo(user.credito_acumulado)}
                      </span>
                    </div>

                    {/* Notificaciones dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="relative">
                          <Bell className="w-5 h-5" />
                          {notificaciones.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {notificaciones.length}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-96 max-h-96 overflow-y-auto py-3">
                        <DropdownMenuLabel>Notificaciones ({notificaciones.length})</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notificaciones.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground text-sm">
                            No hay notificaciones
                          </div>
                        ) : (
                          notificaciones.map((notif) => (
                            <div key={notif.id} className="px-2 py-2 border-b border-border hover:bg-accent/10 rounded">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm break-words">{notif.mensaje}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatearFecha(notif.fecha_envio)}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Desktop Auth Buttons - User Dropdown */}
          <div className="hidden md:flex items-center gap-3 px-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-semibold">
                      {user.nombre.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{user.nombre} {user.apellido}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user.correo}
                    </span>
                  </DropdownMenuLabel>
                  {user.rol === 'ASISTENTE' && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-2 text-sm">
                        <p className="text-muted-foreground text-xs">Saldo abonado:</p>
                        <p className="text-lg font-bold text-accent mt-1">
                          {formatearSaldo(user.credito_acumulado)}
                        </p>
                      </div>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>{user.rol === 'PRODUCTOR' ? 'Productor' : 'Asistente'}</span>
                  </DropdownMenuItem>
                  {user.rol === 'PRODUCTOR' && (
                    <Link to="/create-festival" className="w-full">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Plus className="w-4 h-4" />
                        Crear Festival
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {user.rol === 'PRODUCTOR' && (
                    <Link to="/manage-festivals" className="w-full">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Pencil className="w-4 h-4" />
                        Panel
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {user.rol === 'PRODUCTOR' && (
                    <Link to="/create-performance" className="w-full">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Mic2 className="w-4 h-4" />
                        Crear Presentación
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {user.rol === 'PRODUCTOR' && (
                    <Link to="/manage-performances" className="w-full">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Music className="w-4 h-4" />
                        Ver Presentaciones
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {user.rol === 'PRODUCTOR' && (
                    <Link to="/access-control" className="w-full">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Ticket className="w-4 h-4" />
                        Control de Acceso
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {user.rol === 'ASISTENTE' && (
                    <Link to="/my-tickets" className="w-full">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Ticket className="w-4 h-4" />
                        Mis Tickets
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {user.rol === 'ASISTENTE' && (
                    <Link to="/my-purchases" className="w-full">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <ShoppingCart className="w-4 h-4" />
                        Mis Compras
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Ingresar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="ghost" size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <div className="border-t border-border pt-4 space-y-2">
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-2">
                    <p className="font-semibold text-sm">{user.nombre} {user.apellido}</p>
                    <p className="text-xs text-muted-foreground">{user.correo}</p>
                    {user.rol === 'ASISTENTE' && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">Saldo abonado:</p>
                        <p className="text-base font-bold text-accent mt-1">
                          {formatearSaldo(user.credito_acumulado)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Notificaciones para mobile */}
                  {user.rol === 'ASISTENTE' && (
                    <Link to="#" onClick={(e) => e.preventDefault()} className="block">
                      <Button variant="ghost" className="w-full justify-start gap-2 relative">
                        <Bell className="w-4 h-4" />
                        Notificaciones
                        {notificaciones.length > 0 && (
                          <span className="ml-auto text-xs bg-destructive text-white px-2 py-1 rounded-full">
                            {notificaciones.length}
                          </span>
                        )}
                      </Button>
                    </Link>
                  )}

                  {/* Mostrar notificaciones en mobile si están disponibles */}
                  {user.rol === 'ASISTENTE' && notificaciones.length > 0 && (
                    <div className="px-4 py-2 border-t border-border space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">Notificaciones ({notificaciones.length}):</p>
                      {notificaciones.map((notif) => (
                        <div key={notif.id} className="p-2 bg-muted rounded text-xs space-y-1">
                          <p className="break-words">{notif.mensaje}</p>
                          <p className="text-muted-foreground text-xs">
                            {formatearFecha(notif.fecha_envio)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Role-specific mobile menu items */}
                  {user.rol === 'PRODUCTOR' && (
                    <>
                      <Link to="/create-festival" onClick={() => setIsMenuOpen(false)} className="block">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Plus className="w-4 h-4" />
                          Crear Festival
                        </Button>
                      </Link>
                      <Link to="/create-presentacion" onClick={() => setIsMenuOpen(false)} className="block">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Mic2 className="w-4 h-4" />
                          Crear Presentación
                        </Button>
                      </Link>
                      <Link to="/manage-festivals" onClick={() => setIsMenuOpen(false)} className="block">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Pencil className="w-4 h-4" />
                          Gestionar Festivales
                        </Button>
                      </Link>
                      <Link to="/manage-presentaciones" onClick={() => setIsMenuOpen(false)} className="block">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Music className="w-4 h-4" />
                          Ver Presentaciones
                        </Button>
                      </Link>
                      <Link to="/access-control" onClick={() => setIsMenuOpen(false)} className="block">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Ticket className="w-4 h-4" />
                          Control de Acceso
                        </Button>
                      </Link>
                    </>
                  )}

                  {user.rol === 'ASISTENTE' && (
                    <Link to="/my-tickets" onClick={() => setIsMenuOpen(false)} className="block">
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Ticket className="w-4 h-4" />
                        Mis Tickets
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Ingresar
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block">
                    <Button className="w-full justify-start gap-2">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBarComponent;
