import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PosicionesService {

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) { }


    async obtenerPosicionesPorTorneo(idTorneo: number) {
        return await this.dataSource.query(
            'EXEC sp_ObtenerTablaPosiciones @Id_Torneo=@0', [idTorneo]
        );
    }


    async consultarPorTorneo(idTorneo: number) {
        return await this.dataSource.query(
            'EXEC sp_ConsultarPosiciones @IdTorneo=@0', [idTorneo]
        );
    }


    async crear(dto: any) {
        return await this.dataSource.query(
            `INSERT INTO Posiciones (Id_Fase, Id_Participante, Puntos, PJ, PG, PE, PP, Score_Favor, Score_Contra)
             VALUES (@0, @1, @2, @3, @4, @5, @6, @7, @8)`,
            [
                dto.Id_Fase,
                dto.Id_Participante,
                dto.Puntos ?? 0,
                dto.PJ ?? 0,
                dto.PG ?? 0,
                dto.PE ?? 0,
                dto.PP ?? 0,
                dto.Score_Favor ?? 0,
                dto.Score_Contra ?? 0
            ]
        );
    }


    async actualizar(id: number, dto: any) {
        await this.dataSource.query(
            `UPDATE Posiciones SET
                Puntos = ISNULL(@1, Puntos),
                PJ     = ISNULL(@2, PJ),
                PG     = ISNULL(@3, PG),
                PE     = ISNULL(@4, PE),
                PP     = ISNULL(@5, PP),
                Score_Favor   = ISNULL(@6, Score_Favor),
                Score_Contra  = ISNULL(@7, Score_Contra)
             WHERE Id_Posicion = @0`,
            [id, dto.Puntos ?? null, dto.PJ ?? null, dto.PG ?? null,
                dto.PE ?? null, dto.PP ?? null, dto.Score_Favor ?? null, dto.Score_Contra ?? null]
        );
        return { success: true, message: `Posición ${id} actualizada` };
    }


    async eliminar(id: number) {
        await this.dataSource.query(
            'DELETE FROM Posiciones WHERE Id_Posicion = @0', [id]
        );
        return { success: true, message: `Posición ${id} eliminada` };
    }
}