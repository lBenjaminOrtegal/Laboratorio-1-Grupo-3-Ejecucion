/**
 * Este archivo contiene funciones de validación para datos de entrada en una aplicación web.
 */
import {HttpError} from './http-error.js';


/**
 * Valida que el ID proporcionado sea un número entero positivo dentro del rango permitido (1 a 2147483647).
 * @param id
 */
export function validarId(id: number) {
    if (!Number.isInteger(id) || id < 1 || id > 2147483647) throw new HttpError(400, 'ID debe ser un entero positivo válido.');
}


/**
 * Valida los datos del cuerpo de la solicitud.
 * @param body - El cuerpo de la solicitud a validar.
 * @param update - Indica si es una actualización (true) o una creación (false).
 * @param fields - Las claves permitidas en el cuerpo de la solicitud.
 * @param required - Las claves obligatorias en el cuerpo de la solicitud.
 *
 */
export function validarDatos(body: unknown, update: boolean, fields: string[], required: string[]) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'Se requiere un objeto JSON.');
    const data = body as Record<string, unknown>;
    if (!Object.keys(data).length || Object.keys(data).some(k => !fields.includes(k))) throw new HttpError(400, 'Cuerpo vacío o campos desconocidos.');
    if (!update && required.some(k => data[k] === undefined)) throw new HttpError(400, 'Faltan campos obligatorios: ' + required.join(', '));
    if (Object.values(data).some(v => v === null)) throw new HttpError(400, 'No se permiten valores null.');
    return data;
}

/**
 * Valida que un campo del objeto sea un texto no vacío y no exceda la longitud máxima.
 * @param data - El objeto que contiene el campo a validar.
 * @param key - La clave del campo a validar.
 * @param max - La longitud máxima permitida.
 */
export function texto(data: Record<string, unknown>, key: string, max: number) {
    if (data[key] !== undefined && (typeof data[key] !== 'string' || !(data[key] as string).trim() || (data[key] as string).length > max)) throw new HttpError(400, key + ' debe ser texto no vacío, máximo ' + max + ' caracteres.');
}
