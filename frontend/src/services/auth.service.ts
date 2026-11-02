import httpClient from './api';
import Cookies from 'js-cookie';

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rol?: 'PRODUCTOR' | 'ASISTENTE';
}

export interface AuthResponse {
  mensaje: string;
  token: string;
  usuario?: {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
    credito_acumulado: string;
    activo: boolean;
  };
}

export interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  credito_acumulado: string;
  activo: boolean;
}

const TOKEN_COOKIE_NAME = 'cedofest_token';
const TOKEN_COOKIE_EXPIRES = 7; // 7 días

const authService = {
  /**
   * Registra un nuevo usuario
   */
  register: async (data: RegisterRequest) => {
    const response = await httpClient.post('/api/auth/register', {
      ...data,
      rol: data.rol || 'ASISTENTE', // Por defecto asistente
    });
    return response.data;
  },

  /**
   * Inicia sesión y guarda el token en cookies
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await httpClient.post('/api/auth/login', credentials);
    const data = response.data as AuthResponse;

    // Guardar token en cookies seguras
    if (data.token) {
      Cookies.set(TOKEN_COOKIE_NAME, data.token, {
        expires: TOKEN_COOKIE_EXPIRES,
        secure: true, // Solo HTTPS
        sameSite: 'Strict', // Protección CSRF
        path: '/',
      });

      // También guardar token en la cabecera de Axios para futuras peticiones
      httpClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }

    return data;
  },

  /**
   * Cierra sesión y elimina el token
   */
  logout: () => {
    // Eliminar cookie
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });

    // Eliminar header de Axios
    delete httpClient.defaults.headers.common['Authorization'];
  },

  /**
   * Obtiene el token guardado en cookies
   */
  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated: (): boolean => {
    return !!Cookies.get(TOKEN_COOKIE_NAME);
  },

  /**
   * Obtiene el perfil del usuario autenticado
   */
  getProfile: async (): Promise<UserProfile> => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    
    if (!token) {
      throw new Error('No hay token disponible');
    }

    // Asegurar que el token esté en la cabecera
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = await httpClient.get('/api/auth/profile');
    return response.data;
  },

  /**
   * Inicializa el servicio cargando el token desde cookies
   */
  initializeAuth: () => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    if (token) {
      httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
};

export default authService;
