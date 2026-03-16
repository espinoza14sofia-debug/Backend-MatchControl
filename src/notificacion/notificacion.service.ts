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

    async obtenerTodas() {
        return await this.repo.find({
            order: { Fecha_Envio: 'DESC' }
        });
    }

    async obtenerPorUsuario(idUsuario: number) {
        return await this.repo.find({
            where: { Id_Usuario: idUsuario },
            order: { Fecha_Envio: 'DESC' }
        });
    }

    async crear(data: any) {
        const nueva = this.repo.create(data);
        return await this.repo.save(nueva);
    }

    async marcarLeida(id: number) {
        await this.repo.update(id, { Leido: true });
        return { mensaje: 'Notificación leída' };
    }

    async eliminar(id: number) {
        const resultado = await this.repo.delete(id);
        if (resultado.affected === 0) {
            throw new NotFoundException('La notificación no existe');
        }
        return { mensaje: `Notificación ${id} eliminada correctamente` };
    }
}