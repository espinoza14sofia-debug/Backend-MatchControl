import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TorneoService {

    constructor(
        @InjectDataSource()
        private dataSource: DataSource
    ) { }

    // Crear torneo usando SP
    async crear(dto: any) {

        const sql = `
        EXEC sp_InsertarTorneo
        @IdDisciplina = @0,
        @IdOrganizacion = @1,
        @IdCreador = @2,
        @Nombre = @3,
        @Formato = @4,
        @MaxParticipantes = @5,
        @FechaInicio = @6,
        @FechaFin = @7
        `;

        const values = [
            Number(dto.Id_Disciplina),
            Number(dto.Id_Organizacion),
            Number(dto.Id_Creador),
            String(dto.Nombre),
            String(dto.Formato),
            Number(dto.Max_Participantes),
            dto.Fecha_Inicio ? new Date(dto.Fecha_Inicio) : null,
            dto.Fecha_Fin ? new Date(dto.Fecha_Fin) : null
        ];

        return await this.dataSource.query(sql, values);
    }

    // Obtener todos los torneos
    async findAll() {

        const sql = `
        SELECT *
        FROM Torneo
        ORDER BY Fecha_Creacion DESC
        `;

        return await this.dataSource.query(sql);
    }

    // Obtener torneo por ID
    async findOne(id: number) {

        const sql = `
        SELECT *
        FROM Torneo
        WHERE Id_Torneo = @0
        `;

        const res = await this.dataSource.query(sql, [id]);

        return res.length > 0 ? res[0] : null;
    }

    // Cambiar estado del torneo
    async cambiarEstado(id: number, estado: string) {

        const sql = `
        UPDATE Torneo
        SET Estado = @1
        WHERE Id_Torneo = @0
        `;

        await this.dataSource.query(sql, [id, String(estado)]);

        return {
            success: true,
            message: `Estado del torneo ${id} cambiado a ${estado}`
        };
    }

    // Eliminar torneo usando SP
    async eliminar(id: number) {

        const sql = `
        EXEC sp_EliminarTorneo
        @IdTorneo = @0
        `;

        await this.dataSource.query(sql, [id]);

        return {
            success: true,
            message: `Torneo ${id} eliminado correctamente`
        };
    }
}