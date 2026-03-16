import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MatchService {
    constructor(@InjectDataSource() private dataSource: DataSource) { }
    async crear(dto: any) {

        const sql = `INSERT INTO Match (Id_Fase, Id_Grupo, Id_Arbitro, Fecha_Hora, Ubicacion, Estado) 
    VALUES (@0, @1, @2, @3, @4, @5)
    `;

        return await this.dataSource.query(sql, [
            dto.Id_Fase,
            dto.Id_Grupo ?? null,
            dto.Id_Arbitro ?? null,
            dto.Fecha_Hora ?? null,
            dto.Ubicacion ?? 'Por definir',
            dto.Estado ?? 'Programado'
        ]);
    }

    async findAll() {
        return await this.dataSource.query('SELECT * FROM Match');
    }


    async findByFase(idFase: number) {
        return await this.dataSource.query(
            'SELECT * FROM Match WHERE Id_Fase = @0',
            [idFase]
        );
    }


    async findOne(id: number) {
        const res = await this.dataSource.query(
            'SELECT * FROM Match WHERE Id_Match = @0',
            [id]
        );
        return res[0];
    }


    async actualizar(id: number, dto: any) {

        const params = [
            id,
            dto.Id_Fase !== undefined ? dto.Id_Fase : null,
            dto.Id_Grupo !== undefined ? dto.Id_Grupo : null,
            dto.Id_Arbitro !== undefined ? dto.Id_Arbitro : null,
            dto.Fecha_Hora !== undefined ? dto.Fecha_Hora : null,
            dto.Ubicacion !== undefined ? dto.Ubicacion : null,
            dto.Estado !== undefined ? dto.Estado : null
        ];

        const sql = `
      UPDATE Match 
      SET Id_Fase = ISNULL(@1, Id_Fase),
          Id_Grupo = ISNULL(@2, Id_Grupo),
          Id_Arbitro = ISNULL(@3, Id_Arbitro),
          Fecha_Hora = CASE 
                          WHEN @4 IS NULL THEN Fecha_Hora 
                          ELSE CAST(@4 AS DATETIME) 
                       END,
          Ubicacion = ISNULL(@5, Ubicacion),
          Estado = ISNULL(@6, Estado)
      WHERE Id_Match = @0
    `;

        return await this.dataSource.query(sql, params);
    }


    async eliminar(id: number) {

        await this.dataSource.query(
            'DELETE FROM Match_Set WHERE Id_Match = @0',
            [id]
        );

        await this.dataSource.query(
            'DELETE FROM Match_Participante WHERE Id_Match = @0',
            [id]
        );

        return await this.dataSource.query(
            'DELETE FROM Match WHERE Id_Match = @0',
            [id]
        );
    }
}