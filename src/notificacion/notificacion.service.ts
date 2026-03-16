import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';

@Injectable()
export class NotificacionService {
    constructor(
        @InjectRepository(Notificacion)
        private readonly repo: Repository<Notificacion>,
    ) { }

    // Devuelve todas las notificaciones, ordenadas por fecha descendente
    async obtenerTodas() {
        return await this.repo.find({
            order: { Fecha_Envio: 'DESC' }
        });
    }

    // Devuelve todas las notificaciones de un usuario específico
    async obtenerPorUsuario(idUsuario: number) {
        return await this.repo.find({
            where: { Id_Usuario: idUsuario },
            order: { Fecha_Envio: 'DESC' }
        });
    }

    // Crea una nueva notificación
    async crear(data: any) {
        const nueva = this.repo.create(data);
        return await this.repo.save(nueva);
    }

    // Marca una notificación como leída
    async marcarLeida(id: number) {
        await this.repo.update(id, { Leido: true });
        return { mensaje: 'Notificación leída' };
    }

    // Elimina una notificación
    async eliminar(id: number) {
        const resultado = await this.repo.delete(id);
        if (resultado.affected === 0) {
            throw new NotFoundException('La notificación no existe');
        }
        return { mensaje: `Notificación ${id} eliminada correctamente` };
    }
}