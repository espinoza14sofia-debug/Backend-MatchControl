import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MatchService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async crear(dto: any) {

        return await this.dataSource.query(
            'EXEC sp_InsertarMatch @IdFase=@0, @IdGrupo=@1, @IdArbitro=@2, @FechaHora=@3, @Ubicacion=@4',
            [
                dto.Id_Fase,
                dto.Id_Grupo ?? null,
                dto.Id_Arbitro ?? null,
                dto.Fecha_Hora ?? null,
                dto.Ubicacion ?? 'Por definir'
            ]
        );
    }

    async findAll() {
        return await this.dataSource.query(`
            SELECT m.*, f.Nombre as Nombre_Fase, g.Nombre as Nombre_Grupo 
            FROM Match m
            LEFT JOIN Fase f ON m.Id_Fase = f.Id_Fase
            LEFT JOIN Grupo g ON m.Id_Grupo = g.Id_Grupo
            ORDER BY m.Fecha_Hora DESC
        `);
    }

    async findOne(id: number) {
        const res = await this.dataSource.query(
            'SELECT * FROM Match WHERE Id_Match = @0',
            [id]
        );
        if (!res[0]) throw new NotFoundException(`Match ${id} no encontrado`);
        return res[0];
    }

    async findByFase(idFase: number) {
        return await this.dataSource.query(
            'SELECT * FROM Match WHERE Id_Fase = @0 ORDER BY Fecha_Hora ASC',
            [idFase]
        );
    }

    async actualizarResultado(id: number, dto: any) {
        return await this.dataSource.query(
            'EXEC sp_ActualizarResultadoMatch @IdMatch=@0, @Estado=@1, @IdGanador=@2',
            [id, dto.Estado, dto.Id_Ganador ?? null]
        );
    }

    async actualizarMetadata(id: number, dto: any) {
        const sql = `
            UPDATE Match 
            SET Id_Arbitro = ISNULL(@1, Id_Arbitro),
                Fecha_Hora = ISNULL(@2, Fecha_Hora),
                Ubicacion = ISNULL(@3, Ubicacion)
            WHERE Id_Match = @0
        `;
        return await this.dataSource.query(sql, [id, dto.Id_Arbitro, dto.Fecha_Hora, dto.Ubicacion]);
    }

    async eliminar(id: number) {
        return await this.dataSource.query(
            'EXEC sp_EliminarMatch @IdMatch=@0',
            [id]
        );
    }
}