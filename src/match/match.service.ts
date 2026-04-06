import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MatchService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }


    async crear(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarMatch @IdFase=@0, @Ubicacion=@1',
            [dto.Id_Fase, dto.Ubicacion ?? 'Por definir']
        );
    }

    async findAll() {
        const result = await this.dataSource.query('EXEC sp_ObtenerMatch');
        return { success: true, data: result };
    }

    async findOne(id: number) {
        const result = await this.dataSource.query(
            'EXEC sp_ObtenerMatch @IdMatch=@0', [id]
        );
        if (!result || result.length === 0)
            throw new NotFoundException(`Match ${id} no encontrado`);
        return { success: true, data: result[0] };
    }


    async findByFase(idFase: number) {
        const result = await this.dataSource.query(
            'EXEC sp_ObtenerMatch @IdFase=@0', [idFase]
        );
        return { success: true, data: result };
    }


    async actualizar(id: number, dto: any) {
        await this.dataSource.query(
            'EXEC sp_ActualizarMatch @IdMatch=@0, @IdArbitro=@1, @FechaHora=@2, @Ubicacion=@3, @Estado=@4',
            [id, dto.Id_Arbitro ?? null, dto.Fecha_Hora ?? null, dto.Ubicacion ?? null, dto.Estado ?? null]
        );
        return { success: true, message: `Match ${id} actualizado` };
    }


    async registrarResultado(id: number, dto: any) {
        return await this.dataSource.query(
            'EXEC sp_RegistrarResultadoMatch @IdMatch=@0, @IdP1=@1, @Score1=@2, @IdP2=@3, @Score2=@4',
            [id, dto.IdP1, dto.Score1, dto.IdP2, dto.Score2]
        );
    }


    async eliminar(id: number) {
        await this.dataSource.query('EXEC sp_EliminarMatch @IdMatch=@0', [id]);
        return { success: true, message: `Match ${id} eliminado` };
    }
}