import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sancion } from './entities/sancion.entity';


@Injectable()
export class SancionService {

    constructor(
        @InjectRepository(Sancion)
        private readonly repo: Repository<Sancion>,
    ) { }

    async obtenerTodas() {
        return await this.repo.find();
    }

    async obtenerPorTorneo(idTorneo: number) {
        return await this.repo.find({ where: { Id_Torneo: idTorneo } });
    }

    async crear(data: any) {
        const nuevaSancion = this.repo.create(data);
        return await this.repo.save(nuevaSancion);
    }


    async actualizar(id: number, data: any) {
        await this.repo.update(id, data);
        const actualizado = await this.repo.findOneBy({ Id_Sancion: id });
        if (!actualizado) throw new NotFoundException('Sanción no encontrada');
        return actualizado;
    }


    async eliminar(id: number) {
        return await this.repo.delete(id);
    }
}