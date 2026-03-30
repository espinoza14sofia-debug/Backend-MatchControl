import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SancionService {

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async obtenerTodas() {
        return await this.dataSource.query('SELECT * FROM Sancion');
    }

    async obtenerPorTorneo(idTorneo: number) {
        return await this.dataSource.query(
            'SELECT * FROM Sancion WHERE Id_Torneo = @0',
            [idTorneo]
        );
    }

    async crear(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarSancion @IdTorneo=@0, @IdParticipante=@1, @IdMatch=@2, @TipoSancion=@3, @Descripcion=@4, @PuntosPenalizacion=@5',
            [
                dto.Id_Torneo,
                dto.Id_Participante,
                dto.Id_Match ?? null,
                dto.Tipo_Sancion,
                dto.Descripcion,
                dto.Puntos_Penalizacion ?? 0
            ]
        );
    }

    async actualizar(id: number, dto: any) {
        await this.dataSource.query(
            'EXEC sp_ActualizarSancion @IdSancion=@0, @TipoSancion=@1, @Descripcion=@2, @PuntosPenalizacion=@3',
            [
                id,
                dto.Tipo_Sancion,
                dto.Descripcion,
                dto.Puntos_Penalizacion
            ]
        );
        return { success: true, message: `Sanción ${id} actualizada` };
    }

    async eliminar(id: number) {
        await this.dataSource.query(
            'EXEC sp_EliminarSancion @IdSancion = @0',
            [id]
        );
        return { success: true, message: `Sanción ${id} eliminada` };
    }
}