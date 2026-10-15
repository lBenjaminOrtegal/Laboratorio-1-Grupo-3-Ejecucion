import { Request } from 'express';

export interface UserPayload {
  id: number;
  email: string;
  rol: 'PRODUCTOR' | 'ASISTENTE';
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}