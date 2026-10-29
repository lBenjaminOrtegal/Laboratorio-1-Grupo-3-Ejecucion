# 📝 Notas de Migración - Bootstrap → Tailwind + shadcn

## 🎯 Cambios Realizados

### 1. Dependencias Actualizadas
```bash
# Removidas
npm uninstall bootstrap react-bootstrap bootstrap-icons

# Agregadas
npm install tailwindcss postcss autoprefixer
npm install @radix-ui/react-dropdown-menu @radix-ui/react-slot
npm install lucide-react class-variance-authority tailwind-merge tailwindcss-animate
```

### 2. Archivos de Configuración Creados
- `tailwind.config.ts` - Sistema de diseño
- `postcss.config.js` - Procesamiento CSS
- `src/lib/utils.ts` - Función `cn()` para combinar clases

### 3. Componentes shadcn Creados
```
src/components/ui/
├── button.tsx
├── card.tsx
├── input.tsx
├── badge.tsx
└── dropdown-menu.tsx
```

### 4. Componentes Actualizados
- `NavBarComponent.tsx` - Rediseño completo
- `LineUp.tsx` - Rediseño desde cero
- `Spinner.tsx` - Simplificado
- `App.tsx` - Estructura actualizada
- `index.css` - Estilos base + variables CSS

---

## 🚀 Cómo Usar

### Instalación
```bash
cd frontend
npm install
npm run dev
```

### Importar Componentes UI
```jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
```

### Usar la Función cn()
```jsx
import { cn } from "@/lib/utils";

// Combina clases de Tailwind inteligentemente
className={cn(
  "p-4 rounded-lg",
  isActive && "bg-accent",
  "hover:shadow-md"
)}
```

### Iconos Lucide React
```jsx
import { Menu, X, Music, Home, Ticket, LogOut, User } from "lucide-react";

<Music className="w-5 h-5 text-accent" />
```

---

## 📊 Comparación Antes vs Después

### Botones
```jsx
// Antes (Bootstrap)
<button className="btn btn-primary">Click</button>

// Después (shadcn)
<Button>Click</Button>
<Button variant="outline">Click</Button>
<Button size="lg">Click</Button>
```

### Cards
```jsx
// Antes (Bootstrap)
<div className="card">
  <div className="card-body">
    <h5 className="card-title">Título</h5>
    <p className="card-text">Contenido</p>
  </div>
</div>

// Después (shadcn)
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Contenido</p>
  </CardContent>
</Card>
```

### Inputs
```jsx
// Antes (Bootstrap)
<input className="form-control" type="text" />

// Después (shadcn)
<Input type="text" placeholder="Ingresa texto..." />
```

### Grid Responsivo
```jsx
// Antes (Bootstrap)
<div className="row">
  <div className="col-md-6 col-lg-4">Item</div>
</div>

// Después (Tailwind)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div>Item</div>
</div>
```

---

## 🎨 Sistema de Colores

### Definidos en `index.css`
```css
:root {
  --accent: 262.1 80% 50.4%;        /* Púrpura */
  --primary: /* Primario */
  --secondary: /* Secundario */
  --destructive: 0 84.2% 60.2%;    /* Rojo */
  --border: 0 0% 89.8%;            /* Gris claro */
  --background: 0 0% 100%;         /* Blanco */
  --foreground: 0 0% 3.6%;         /* Negro */
  /* ... más colores */
}
```

### Usar en Clases
```jsx
<div className="bg-accent text-accent-foreground">
  Fondo púrpura con texto blanco
</div>

<Button className="bg-destructive text-destructive-foreground">
  Acción destructiva
</Button>
```

---

## 📱 Breakpoints Tailwind

```
xs: 0px       (móvil pequeño)
sm: 640px     (móvil)
md: 768px     (tablet)
lg: 1024px    (desktop)
xl: 1280px    (desktop grande)
2xl: 1536px   (ultra ancho)
```

### Ejemplos de Uso
```jsx
<div className="hidden md:block">
  {/* Solo visible en tablet y arriba */}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 columna en móvil, 2 en tablet, 3 en desktop */}
</div>

<h1 className="text-2xl md:text-3xl lg:text-4xl">
  {/* Tamaño responsivo */}
</h1>
```

---

## 🧩 Agregar Más Componentes shadcn

### Instalación Manual
1. Crear archivo en `src/components/ui/`
2. Copiar componente desde [shadcn/ui](https://ui.shadcn.com)
3. Instalar dependencias necesarias si es que las hay
4. Importar y usar

### Ejemplo: Dialog
```bash
npm install @radix-ui/react-dialog
```

Crear `src/components/ui/dialog.tsx` con el código de [shadcn](https://ui.shadcn.com/docs/components/dialog)

Usar:
```jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>Abrir</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descripción</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

---

## 🔗 Recursos Útiles

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Lucide React Icons](https://lucide.dev)

---

## ⚙️ Troubleshooting

### "No se ve el estilo"
- Verificar que `npm install` se ejecutó
- Verificar que `npm run dev` está corriendo
- Limpiar caché: `rm -rf node_modules/.vite && npm run dev`

### "Clase Tailwind no funciona"
- Verificar que está en `index.css` las directivas `@tailwind`
- Verificar que `src/` está en `tailwind.config.ts` paths
- Reiniciar dev server

### "Import de componente falla"
- Verificar que el alias `@/` está en `vite.config.ts` y `tsconfig.json`
- Verificar que la ruta es correcta (ej: `@/components/ui/button`)

---

## 📋 Checklist de Verificación

- [ ] `npm install` ejecutado sin errores
- [ ] `npm run dev` corre sin errores
- [ ] Página carga en `http://localhost:5173`
- [ ] NavBar se ve correctamente
- [ ] LineUp page se ve correctamente
- [ ] Responsive design funciona en móvil
- [ ] No hay errores en consola
- [ ] Componentes shadcn importan correctamente

---

## 💡 Tips y Tricks

### Usar Clases Condicionales
```jsx
import { cn } from "@/lib/utils";

<Button className={cn(
  "default classes",
  isActive && "additional classes"
)}>
  Click
</Button>
```

### Crear Variantes Reutilizables
```jsx
// En un archivo de utilidades
export const buttonClasses = cn(
  "px-4 py-2 rounded-lg",
  "bg-accent text-accent-foreground",
  "hover:bg-accent/90 transition-colors"
);

// Usar en componentes
<button className={buttonClasses}>Click</button>
```

### Dark Mode Toggle (Futura Implementación)
```jsx
// En root
<html className="dark">

// O con script
document.documentElement.classList.toggle("dark");
```

---

## 🚀 Próximas Tareas

1. [ ] Crear página `/festivals`
2. [ ] Implementar Dialog para detalles
3. [ ] Agregar Select para filtros
4. [ ] Autenticación y JWT
5. [ ] Rutas protegidas
6. [ ] Dark mode toggle
7. [ ] Tests E2E

---

**Última actualización:** Octubre 2026
**Estado:** ✅ Migración Completada
**Próximo paso:** `npm install && npm run dev`


---

## ✨ Actualización v2.1.0 - Home Page + LineUp Mejorado

### Nuevos Componentes

#### Select Component
```jsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select value={value} onValueChange={handleChange}>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona una opción" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opcion1">Opción 1</SelectItem>
    <SelectItem value="opcion2">Opción 2</SelectItem>
  </SelectContent>
</Select>
```

### Nuevos Servicios

#### Festival Service
```typescript
import festivalService from "@/services/festival.service";

// Obtener todos los festivales
const festivales = await festivalService.getAll();

// Obtener festival por ID
const festival = await festivalService.getById(1);

// Crear festival
await festivalService.create(data);

// Actualizar festival
await festivalService.update(id, data);

// Eliminar festival
await festivalService.deleteById(id);
```

### Home Page Features

La página Home incluye:
- Hero section con CTA
- 6 Feature cards
- Call-to-action section
- FAQ section
- Footer

Navega a `/`:
```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/"); // Home
navigate("/line-up"); // LineUp
navigate("/festivals"); // Festivals (futura)
```

### LineUp Improvements

#### Auto-Load Presentaciones de Hoy
```typescript
// Se carga automáticamente al montar el componente
useEffect(() => {
  getFestivales();
}, []);

// Cuando festivales cargan
useEffect(() => {
  if (festivalId && festivales.length > 0) {
    getLineUp(festivalId, getTodayDate()); // Auto-load
    setFecha(getTodayDate()); // Set today
  }
}, [festivales]);
```

#### Select de Festivales con Nombres
```typescript
<Select value={String(festivalId)} onValueChange={handleFestivalChange}>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona un festival" />
  </SelectTrigger>
  <SelectContent>
    {festivales.map((festival) => (
      <SelectItem key={festival.id} value={String(festival.id)}>
        {festival.nombre} {/* Nombre, no ID */}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### Cambio Dinámico de Festival
```typescript
const handleFestivalChange = (value: string) => {
  const newFestivalId = Number(value);
  setFestivalId(newFestivalId);
  // Carga automáticamente
  const dateToSearch = fecha || getTodayDate();
  getLineUp(newFestivalId, dateToSearch);
};
```

### Archivos Nuevos en v2.1.0

1. `src/pages/Home.tsx` - Página home completa
2. `src/services/festival.service.ts` - Servicio de festivales
3. `src/components/ui/select.tsx` - Componente Select

### Archivos Actualizados en v2.1.0

1. `package.json` - Agregada `@radix-ui/react-select`
2. `src/pages/LineUp.tsx` - Select + auto-load

### Rutas Disponibles

```
/              → Home (✨ Nuevo)
/line-up       → Line-Up (✅ Mejorado)
/festivals     → Festivales (📋 Pendiente)
```

**Estado:** ✅ v2.1.0 Completado
**Próximo:** Crear página Festivales
