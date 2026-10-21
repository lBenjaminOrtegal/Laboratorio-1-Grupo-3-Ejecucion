import {OrdenCompraRepository} from '../repositories/orden_compra.repository.js';
import {
    CreateOrdenCompraDTO,
    UpdateOrdenCompraDTO
} from '../interfaces/orden_compra.interface.js';

export class OrdenCompraService {
    private ordenCompraRepository: OrdenCompraRepository;

    constructor() {
        this.ordenCompraRepository = new OrdenCompraRepository();
    }

    async obtenerTodas() {
        return await this.ordenCompraRepository.findAll();
    }

    async obtenerPorId(id: number) {
        const ordenCompra = await this.ordenCompraRepository.findById(id);

        if (!ordenCompra) {
            const error: any = new Error('Orden de compra no encontrada.');
            error.status = 404;
            throw error;
        }
        return ordenCompra;
    }

    async crearOrdenCompra(data: CreateOrdenCompraDTO) {
        // Validacion de monto (debe ser un numero positivo)
        if (data.monto < 0) {
            const error: any = new Error('El monto de la orden de compra ingresado no es valido.');
            error.status = 400;
            throw error;
        }
        return await this.ordenCompraRepository.create(data);
    }

    async actualizarOrdenCompra(id: number, data: UpdateOrdenCompraDTO) {
        // Validacion de monto (debe ser un numero positivo)
        if (data.monto !== undefined && data.monto < 0) {
            const error: any = new Error('El monto de la orden de compra ingresado no es valido.');
            error.status = 400;
            throw error;
        }

        const actualizada = await this.ordenCompraRepository.update(id, data);

        // Validacion de existencia de la orden de compra antes de actualizarla
        if (!actualizada) {
            const error: any = new Error('Orden de compra no encontrada.');
            error.status = 404;
            throw error;
        }
        return actualizada;
    }

    async eliminarOrdenCompra(id: number) {
        // Validacion de existencia de la orden de compra antes de eliminarla
        const eliminada = await this.ordenCompraRepository.delete(id);

        if (!eliminada) {
            const error: any = new Error('Orden de compra no encontrada.');
            error.status = 404;
            throw error;
        }

        return {message: 'Orden de compra eliminada exitosamente.'};
    }
}