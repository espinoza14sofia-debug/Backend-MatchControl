import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disciplina } from './entities/disciplina.entity';

// Servicio que contiene la lógica para manejar las disciplinas
@Injectable()
export class DisciplinaService {

    // Se inyecta el repositorio de la entidad Disciplina
    constructor(@InjectRepository(Disciplina) private readonly repo: Repository<Disciplina>) { }

    // Método para crear una nueva disciplina
    async crear(dto: any) {

        // Se ejecuta un procedimiento almacenado para insertar la disciplina
        return await this.repo.query(
            'EXEC sp_InsertarDisciplina @0, @1, @2, @3, @4',
            [dto.Id_Categoria, dto.Nombre, dto.Tipo_Participacion, dto.Min_Integrantes, dto.Max_Integrantes]
        );
    }

    // Método para eliminar una disciplina por su id
    async remove(id: number) {

        // Se ejecuta un procedimiento almacenado para eliminar la disciplina
        return await this.repo.query('EXEC sp_EliminarDisciplina @0', [id]);
    }

    // Método para obtener todas las disciplinas
    async findAll() {

        // Consulta todas las disciplinas usando el repositorio
        return await this.repo.find();
    }
}