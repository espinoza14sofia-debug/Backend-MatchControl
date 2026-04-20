import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DisciplinaService {

    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    async crear(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarDisciplina @IdCategoria=@0, @Nombre=@1, @Tipo=@2, @Min=@3, @Max=@4',
            [dto.id_categoria, dto.nombre, dto.tipo_participacion, dto.min_integrantes, dto.max_integrantes]
        );
    }

    async findAll() {
        const result = await this.dataSource.query('EXEC sp_ObtenerDisciplina');
        return { success: true, data: result };
    }

    async findOne(id: number) {
        const result = await this.dataSource.query(
            'EXEC sp_ObtenerDisciplina @IdDisciplina=@0', [id]
        );
        if (!result || result.length === 0)
            throw new NotFoundException(`Disciplina ${id} no encontrada`);
        return { success: true, data: result[0] };
    }

    async actualizar(id: number, dto: any) {
        await this.dataSource.query(
            'EXEC sp_ActualizarDisciplina @IdDisciplina=@0, @Nombre=@1, @Min=@2, @Max=@3',
            [id, dto.nombre, dto.min_integrantes, dto.max_integrantes]
        );
        return { success: true, message: `Disciplina ${id} actualizada` };
    }

    async remove(id: number) {
        try {
            await this.dataSource.query(
                'EXEC sp_EliminarDisciplina @IdDisciplina=@0', [id]
            );
            return { success: true, message: `Disciplina ${id} eliminada` };
        } catch (error: any) {
            throw new NotFoundException(error.message || 'No se puede eliminar');
        }
    }
}
