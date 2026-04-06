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
            'EXEC sp_ObtenerParticipantesMatch @IdMatch=@0', [idMatch]
        );
    }


    async actualizar(idMatch: number, idPart: number, dto: any) {
        return await this.dataSource.query(
            'EXEC sp_ActualizarParticipanteMatch @IdMatch=@0, @IdParticipante=@1, @ScoreFinal=@2, @EsGanador=@3',
            [idMatch, idPart, dto.Score_Final ?? 0, dto.Es_Ganador ? 1 : 0]
        );
    }


    async eliminar(idMatch: number, idPart: number) {
        return await this.dataSource.query(
            'EXEC sp_EliminarParticipanteMatch @IdMatch=@0, @IdParticipante=@1',
            [idMatch, idPart]
        );
    }
}