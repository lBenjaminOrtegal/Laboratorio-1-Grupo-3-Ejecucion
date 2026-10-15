import { Request, Response, NextFunction } from 'express';

interface DatabaseError extends Error {
  code?: string;
  detail?: string;
}

export const errorHandler = (
  err: DatabaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Excepción lanzada por Triggers (RAISE EXCEPTION en PostgreSQL)
  if (err.code === 'P0001') {
    return res.status(400).json({
      error: 'Regla de negocio violada',
      detalle: err.message,
    });
  }

  // Clave duplicada
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Conflicto de unicidad',
      detalle: err.detail || 'El registro ya existe.',
    });
  }

  return res.status(500).json({
    error: err.message || 'Error interno del servidor',
  });
};