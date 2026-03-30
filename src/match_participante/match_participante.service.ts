import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MatchParticipanteService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async asignar(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_AsignarParticipanteMatch @IdMatch=@0, @IdParticipante=@1, @Lado=@2',
            [dto.Id_Match, dto.Id_Participante, dto.Lado ?? 1]
        );
    }

    async findByMatch(idMatch: number) {
        return await this.dataSource.query(
            `SELECT MP.*, P.Nombre_En_Torneo
             FROM Match_Participante MP
             JOIN Participante P ON MP.Id_Participante = P.Id_Participante
             WHERE MP.Id_Match = @0`,
            [idMatch]
        );
    }

    async actualizar(idMatch: number, idPart: number, dto: any) {
        return await this.dataSource.query(
            'EXEC sp_ActualizarResultadoIndividualMatch @IdMatch=@0, @IdParticipante=@1, @EsGanador=@2, @ScoreFinal=@3',
            [
                idMatch,
                idPart,
                dto.Es_Ganador !== undefined ? (dto.Es_Ganador ? 1 : 0) : null,
                dto.Score_Final
            ]
        );
    }

    async eliminar(idMatch: number, idPart: number) {
        return await this.dataSource.query(
            'EXEC sp_EliminarParticipanteMatch @IdMatch=@0, @IdParticipante=@1',
            [idMatch, idPart]
        );
    }
}