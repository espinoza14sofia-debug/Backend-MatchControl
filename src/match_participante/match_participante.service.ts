import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MatchParticipanteService {
    constructor(@InjectDataSource() private dataSource: DataSource) { }

    async asignar(dto: any) {

        const sql = `
        INSERT INTO Match_Participante
        (Id_Match, Id_Participante, Lado, Es_Ganador, Score_Final)
        VALUES (@0, @1, @2, @3, @4)
        `;

        return await this.dataSource.query(sql, [
            dto.Id_Match,
            dto.Id_Participante,
            dto.Lado ?? 1,
            dto.Es_Ganador ?? 0,
            dto.Score_Final ?? 0
        ]);
    }

    async findByMatch(idMatch: number) {

        const sql = `
        SELECT MP.*, P.Nombre_En_Torneo
        FROM Match_Participante MP
        JOIN Participante P ON MP.Id_Participante = P.Id_Participante
        WHERE MP.Id_Match = @0
        `;

        return await this.dataSource.query(sql, [idMatch]);
    }

    async actualizar(idMatch: number, idPart: number, dto: any) {

        const sql = `
        UPDATE Match_Participante
        SET 
            Lado = ISNULL(@2, Lado),
            Es_Ganador = ISNULL(@3, Es_Ganador),
            Score_Final = ISNULL(@4, Score_Final)
        WHERE Id_Match = @0
        AND Id_Participante = @1
        `;

        return await this.dataSource.query(sql, [
            idMatch,
            idPart,
            dto.Lado,
            dto.Es_Ganador !== undefined ? (dto.Es_Ganador ? 1 : 0) : null,
            dto.Score_Final
        ]);
    }

    async eliminar(idMatch: number, idPart: number) {

        const sql = `
        DELETE FROM Match_Participante
        WHERE Id_Match = @0
        AND Id_Participante = @1
        `;

        return await this.dataSource.query(sql, [idMatch, idPart]);
    }
}