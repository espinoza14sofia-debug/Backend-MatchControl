import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MatchSetService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) { }

    async crear(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarMatchSet @IdMatch=@0, @NumeroSet=@1, @MapaModo=@2, @PuntajeLado1=@3, @PuntajeLado2=@4, @IdGanadorSet=@5',
            [
                dto.Id_Match,
                dto.Numero_Set,
                dto.Mapa_Modo,
                dto.Puntaje_Lado1,
                dto.Puntaje_Lado2,
                dto.Id_Ganador_Set
            ]
        );
    }

    async verPorMatch(idMatch: number) {
        return await this.dataSource.query(
            'SELECT * FROM Match_Set WHERE Id_Match = @0 ORDER BY Numero_Set ASC',
            [idMatch]
        );
    }

    async actualizar(idMatch: number, numSet: number, dto: any) {
        return await this.dataSource.query(
            'EXEC sp_ActualizarMatchSet @IdMatch=@0, @NumeroSet=@1, @MapaModo=@2, @PuntajeLado1=@3, @PuntajeLado2=@4, @IdGanadorSet=@5',
            [
                idMatch,
                numSet,
                dto.Mapa_Modo,
                dto.Puntaje_Lado1,
                dto.Puntaje_Lado2,
                dto.Id_Ganador_Set
            ]
        );
    }

    async eliminar(idMatch: number, numSet: number) {
        return await this.dataSource.query(
            'EXEC sp_EliminarMatchSet @IdMatch=@0, @NumeroSet=@1',
            [idMatch, numSet]
        );
    }
}