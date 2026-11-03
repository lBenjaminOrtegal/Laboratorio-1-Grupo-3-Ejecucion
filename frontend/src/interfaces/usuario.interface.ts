export type RolUsuario = "PRODUCTOR" | "ASISTENTE";

/**
 * Usuario del Sistema
 * Representa un productor o asistente en la plataforma
 * credito_acumulado es NUMERIC(10, 0) en la BD (sin decimales, en pesos chilenos)
 */
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  credito_acumulado: number | string; // NUMERIC(10, 0) del backend, convertir para cálculos
  rol: RolUsuario;
  activo: boolean;
}
