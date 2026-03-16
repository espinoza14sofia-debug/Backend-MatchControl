import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posiciones } from './entities/posiciones.entity';

@Injectable()
export class PosicionesService {

    constructor(
        @InjectRepository(Posiciones)
        private readonly repo: Repository<Posiciones>,
    ) { }

    async verTodas() {
        return await this.repo.find();
    }

    async obtenerPosicionesPorTorneo(idTorneo: number) {
        return await this.repo.query(
            'EXEC sp_ObtenerTablaPosiciones @Id_Torneo = @0',
            [idTorneo]
        );
    }

    async crear(data: any) {
        const nueva = this.repo.create(data);
        return await this.repo.save(nueva);
    }


    async actualizar(id: number, data: any) {
        await this.repo.update(id, data);
        return await this.repo.findOne({ where: { Id_Posicion: id } });
    }


    async eliminar(id: number) {
        return await this.repo.delete(id);
    }
}