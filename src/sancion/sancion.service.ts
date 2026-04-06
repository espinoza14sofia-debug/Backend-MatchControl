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
        return await this.dataSource.query('EXEC sp_ObtenerSancion');
    }

    async obtenerPorTorneo(idTorneo: number) {
        return await this.dataSource.query(
            'EXEC sp_ObtenerSancion @IdTorneo=@0', [idTorneo]
        );
    }

    async obtenerUna(id: number) {
        const result = await this.dataSource.query(
            'EXEC sp_ObtenerSancion @IdSancion=@0', [id]
        );
        if (!result || result.length === 0)
            throw new NotFoundException(`Sanción ${id} no encontrada`);
        return { success: true, data: result[0] };
    }


    async crear(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarSancion @IdTorneo=@0, @IdPart=@1, @Tipo=@2, @Motivo=@3',
            [dto.Id_Torneo, dto.Id_Participante, dto.Tipo_Sancion, dto.Motivo]
        );
    }


    async actualizar(id: number, dto: any) {
        await this.dataSource.query(
            'EXEC sp_ActualizarSancion @IdSancion=@0, @TipoSancion=@1, @Motivo=@2',
            [id, dto.Tipo_Sancion, dto.Motivo]
        );
        return { success: true, message: `Sanción ${id} actualizada` };
    }

    async eliminar(id: number) {
        await this.dataSource.query(
            'EXEC sp_EliminarSancion @IdSancion=@0', [id]
        );
        return { success: true, message: `Sanción ${id} eliminada` };
    }
}