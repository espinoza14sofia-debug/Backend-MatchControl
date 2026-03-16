import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disciplina } from './entities/disciplina.entity';


@Injectable()
export class DisciplinaService {


    constructor(@InjectRepository(Disciplina) private readonly repo: Repository<Disciplina>) { }


    async crear(dto: any) {


        return await this.repo.query(
            'EXEC sp_InsertarDisciplina @0, @1, @2, @3, @4',
            [dto.Id_Categoria, dto.Nombre, dto.Tipo_Participacion, dto.Min_Integrantes, dto.Max_Integrantes]
        );
    }


    async remove(id: number) {


        return await this.repo.query('EXEC sp_EliminarDisciplina @0', [id]);
    }


    async findAll() {


        return await this.repo.find();
    }
}