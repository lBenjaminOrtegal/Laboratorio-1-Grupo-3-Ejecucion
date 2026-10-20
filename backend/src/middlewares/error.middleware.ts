import { Request, Response, NextFunction } from 'express';

interface DatabaseError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
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
      error: 'Regla de negocio violada.',
      detalle: err.message,
    });
  }

  // Clave duplicada
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Conflicto de unicidad.',
      detalle: err.detail || 'El registro ya existe.',
    });
  }

  // Excepción por violación de clave foránea 
  if (err.code === '23503') {
    return res.status(409).json({
      error: 'Conflicto de relación.',
      detalle: err.detail || 'El registro referenciado no existe o no puede eliminarse/modificarse porque tiene datos asociados.',
    });
  }

  // Excepción por CHECK constraint
  if (err.code === '23514') {
    return res.status(400).json({
      error: 'Conflicto de datos.',
      detalle: `Restricción no cumplida: ${err.constraint || err.message}`,
    });
  }

  return res.status(500).json({
    error: err.message || 'Error interno del servidor.',
  });
};