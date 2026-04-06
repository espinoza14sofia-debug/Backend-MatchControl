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
            'EXEC sp_InsertarSet @IdMatch=@0, @Num=@1, @Mapa=@2, @P1=@3, @P2=@4, @Ganador=@5',
            [
                dto.Id_Match,
                dto.Numero_Set,
                dto.Mapa_Modo ?? null,
                dto.Puntaje_Lado1 ?? 0,
                dto.Puntaje_Lado2 ?? 0,
                dto.Id_Ganador_Set ?? null
            ]
        );
    }


    async verPorMatch(idMatch: number) {
        return await this.dataSource.query(
            'EXEC sp_ObtenerSets @IdMatch=@0', [idMatch]
        );
    }


    async actualizar(idMatch: number, numSet: number, dto: any) {
        return await this.dataSource.query(
            'EXEC sp_ActualizarSet @IdMatch=@0, @NumeroSet=@1, @MapaModo=@2, @PuntajeLado1=@3, @PuntajeLado2=@4, @IdGanadorSet=@5',
            [
                idMatch,
                numSet,
                dto.Mapa_Modo ?? null,
                dto.Puntaje_Lado1 ?? null,
                dto.Puntaje_Lado2 ?? null,
                dto.Id_Ganador_Set ?? null
            ]
        );
    }


    async eliminar(idMatch: number, numSet: number) {
        return await this.dataSource.query(
            'EXEC sp_EliminarSet @IdMatch=@0, @NumeroSet=@1',
            [idMatch, numSet]
        );
    }
}