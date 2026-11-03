/**
 * Interfaz para registrar validaciones de tickets en el historial
 */
export interface ValidationHistoryEntry {
  code: string;
  timestamp: Date;
  success: boolean;
  message: string;
}

/**
 * Interfaz para estadísticas de validación
 */
export interface ValidationStats {
  totalAttempts: number;
  successCount: number;
  failureCount: number;
}
