import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Disciplina } from './entities/disciplina.entity';

@Injectable()
export class DisciplinaService {

    constructor(
        @InjectRepository(Disciplina)
        private readonly repo: Repository<Disciplina>,
        private readonly dataSource: DataSource,
    ) { }

    async crear(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarDisciplina @IdCategoria=@0, @Nombre=@1, @TipoParticipacion=@2, @Min=@3, @Max=@4',
            [dto.Id_Categoria, dto.Nombre, dto.Tipo_Participacion, dto.Min_Integrantes, dto.Max_Integrantes]
        );
    }

    async findAll() {
        return await this.repo.find();
    }

    async findOne(id: number) {
        const res = await this.dataSource.query(
            'SELECT * FROM Disciplina WHERE Id_Disciplina = @0',
            [id]
        );
        if (!res[0]) throw new NotFoundException(`Disciplina ${id} no encontrada`);
        return res[0];
    }

    async actualizar(id: number, dto: any) {
        return await this.dataSource.query(
            'EXEC sp_ActualizarDisciplina @IdDisciplina=@0, @Nombre=@1, @Min=@2, @Max=@3',
            [id, dto.Nombre, dto.Min_Integrantes, dto.Max_Integrantes]
        );
    }

    async remove(id: number) {
        return await this.dataSource.query(
            'EXEC sp_EliminarDisciplina @IdDisciplina=@0',
            [id]
        );
    }
}