import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TorneoService {

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) { }

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
            dto.Id_Disciplina,
            dto.Id_Organizacion,
            dto.Id_Creador,
            dto.Nombre,
            dto.Formato,
            dto.Max_Participantes,
            dto.Fecha_Inicio,
            dto.Fecha_Fin
        ];

        return await this.dataSource.query(sql, values);
    }

    async findAll() {
        return await this.dataSource.query('SELECT * FROM Torneo ORDER BY Fecha_Creacion DESC');
    }

    async findOne(id: number) {
        const res = await this.dataSource.query('SELECT * FROM Torneo WHERE Id_Torneo = @0', [id]);
        if (!res[0]) throw new NotFoundException(`Torneo ${id} no encontrado`);
        return res[0];
    }

    async cambiarEstado(id: number, estado: string) {
        await this.dataSource.query(
            'EXEC sp_ActualizarTorneoEstado @IdTorneo=@0, @Estado=@1',
            [id, estado]
        );

        return {
            success: true,
            message: `Estado del torneo ${id} cambiado a ${estado}`
        };
    }

    async detalle(id: number) {
        const res = await this.dataSource.query(
            'EXEC sp_ConsultarTorneoDetalle @IdTorneo=@0',
            [id]
        );
        return res[0];
    }

    async eliminar(id: number) {
        await this.dataSource.query('EXEC sp_EliminarTorneo @IdTorneo = @0', [id]);

        return {
            success: true,
            message: `Torneo ${id} eliminado correctamente`
        };
    }
}