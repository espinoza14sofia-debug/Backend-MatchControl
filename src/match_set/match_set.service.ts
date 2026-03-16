import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


@Injectable()
export class MatchSetService {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource
    ) { }

    async crear(dto: any) {

        const query = `
        INSERT INTO Match_Set 
        (Id_Match, Numero_Set, Mapa_Modo, Puntaje_Lado1, Puntaje_Lado2, Id_Ganador_Set)
        VALUES (@0, @1, @2, @3, @4, @5)
        `;

        return await this.dataSource.query(query, [
            dto.Id_Match,
            dto.Numero_Set,
            dto.Mapa_Modo,
            dto.Puntaje_Lado1,
            dto.Puntaje_Lado2,
            dto.Id_Ganador_Set
        ]);
    }

    async verPorMatch(idMatch: number) {

        const query = `
        SELECT *
        FROM Match_Set
        WHERE Id_Match = @0
        ORDER BY Numero_Set ASC
        `;

        return await this.dataSource.query(query, [idMatch]);
    }

    async actualizar(idMatch: number, numSet: number, dto: any) {

        const query = `
        UPDATE Match_Set
        SET 
            Mapa_Modo = ISNULL(CAST(@2 AS NVARCHAR(200)), Mapa_Modo),
            Puntaje_Lado1 = ISNULL(CAST(@3 AS INT), Puntaje_Lado1),
            Puntaje_Lado2 = ISNULL(CAST(@4 AS INT), Puntaje_Lado2),
            Id_Ganador_Set = ISNULL(CAST(@5 AS INT), Id_Ganador_Set)
        WHERE Id_Match = CAST(@0 AS INT)
        AND Numero_Set = CAST(@1 AS INT)
        `;

        return await this.dataSource.query(query, [
            idMatch,
            numSet,
            dto.Mapa_Modo !== undefined ? dto.Mapa_Modo : null,
            dto.Puntaje_Lado1 !== undefined ? dto.Puntaje_Lado1 : null,
            dto.Puntaje_Lado2 !== undefined ? dto.Puntaje_Lado2 : null,
            dto.Id_Ganador_Set !== undefined ? dto.Id_Ganador_Set : null
        ]);
    }

    async eliminar(idMatch: number, numSet: number) {

        const query = `
        DELETE FROM Match_Set
        WHERE Id_Match = @0
        AND Numero_Set = @1
        `;

        return await this.dataSource.query(query, [idMatch, numSet]);
    }
}