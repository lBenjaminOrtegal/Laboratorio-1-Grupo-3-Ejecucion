export type RolUsuario = 'PRODUCTOR' | 'ASISTENTE'; 


export interface CreateUsuarioDTO { 
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  credito_acumulado?: number;
  rol: RolUsuario;
}
// Para actualizar, se usa Partial para hacer que todas las propiedades de CreateUsuarioDTO sean opcionales.
export type UpdateUsuarioDTO = Partial<CreateUsuarioDTO>;

/**
 * Se usa para manejar usuarios en la capa de repositorio y servicio sin exponer la contraseña del usuario.
 */
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  credito_acumulado: string; // pg (PostgreSQL) devuelve NUMERIC como string para conservar precisión.
  rol: RolUsuario;
}
