import { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, ArrowRight, Filter, X, Loader, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import festivalService from '@/services/festival.service';
import type { Festival } from '@/interfaces/festival.interface';
import { formatearFecha, getStatusColor, getStatusLabel } from '@/utils/formatUtils';
import { useNavigate } from 'react-router-dom';

function Festivals() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [filteredFestivals, setFilteredFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Cargar festivales
  useEffect(() => {
    const loadFestivals = async () => {
      try {
        setLoading(true);
        const response = await festivalService.getAll();
        // Manejar diferentes formatos de respuesta del backend
        let data: Festival[] = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data?.value && Array.isArray(response.data.value)) {
          data = response.data.value;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        }
        setFestivals(data);
        setFilteredFestivals(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar festivales:', err);
        setError('No se pudieron cargar los festivales');
        setFestivals([]);
        setFilteredFestivals([]);
      } finally {
        setLoading(false);
      }
    };

    loadFestivals();
  }, []);

  // Filtrar festivales
  useEffect(() => {
    let result = festivals;

    // Filtrar por búsqueda
    if (searchTerm) {
      result = result.filter((festival) =>
        festival.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter && statusFilter !== 'todos') {
      result = result.filter((festival) => festival.estado === statusFilter);
    }

    setFilteredFestivals(result);
  }, [searchTerm, statusFilter, festivals]);

  return (
    <div className="w-full bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Festivales
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Descubre todos los festivales disponibles y encuentra el próximo evento que te espera
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar festivales..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Toggle and Filters */}
          <div className="flex gap-2">
            <Button
              variant={showFilters ? 'outline' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>

            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setSearchTerm('')}
              >
                <X className="w-4 h-4" />
                Limpiar búsqueda
              </Button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="p-4 rounded-lg border border-border bg-card space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Estado</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setStatusFilter('');
                  setShowFilters(false);
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-accent animate-spin mb-4" />
            <p className="text-muted-foreground">Cargando festivales...</p>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        ) : filteredFestivals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No se encontraron festivales
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Vuelve pronto, habrá nuevos festivales disponibles'}
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Mostrando <span className="font-semibold text-foreground">{filteredFestivals.length}</span> de{' '}
                <span className="font-semibold text-foreground">{festivals.length}</span> festivales
              </p>
            </div>

            {/* Festival Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFestivals.map((festival) => (
                <Card
                  key={festival.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow hover:border-accent cursor-pointer group"
                >
                  {/* Header with Status */}
                  <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-4 flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                        {festival.nombre}
                      </h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getStatusColor(festival.estado)}`}>
                      {getStatusLabel(festival.estado)}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="pt-4 space-y-4">
                    {/* Dates */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>
                          {formatearFecha(festival.fecha_inicio.toString())} - {formatearFecha(festival.fecha_fin.toString())}
                        </span>
                      </div>
                    </div>

                    {/* Venue Info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                      <span>{festival.nombre_recinto}, {festival.ciudad_recinto}</span>
                    </div>

                    {/* Producer Info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4 text-accent flex-shrink-0" />
                      <span>{festival.nombre_productor} {festival.apellido_productor}</span>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 border-t border-border">
                      <Button
                        className="w-full gap-2 group/btn"
                        variant={festival.estado === 'ACTIVO' ? 'default' : 'outline'}
                        disabled={festival.estado !== 'ACTIVO'}
                        onClick={() => navigate(`/festivals/${festival.id}`)}
                      >
                        {festival.estado === 'ACTIVO' ? (
                          <>
                            Ver Detalles
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        ) : (
                          `Festival ${getStatusLabel(festival.estado)}`
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Festivals;
