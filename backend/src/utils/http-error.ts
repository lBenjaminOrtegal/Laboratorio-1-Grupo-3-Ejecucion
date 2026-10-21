/**
 * Es una clase de error personalizada que extiende la clase Error incorporada en JavaScript.
 * Se utiliza para representar errores HTTP y contiene un código de estado HTTP y un mensaje de error.
 */
export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}
