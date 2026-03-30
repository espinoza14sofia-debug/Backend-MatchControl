import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PosicionesService {

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) { }

    async verTodas() {
        return await this.dataSource.query('SELECT * FROM Posiciones');
    }

    async obtenerPosicionesPorTorneo(idTorneo: number) {
        return await this.dataSource.query(
            'EXEC sp_ObtenerTablaPosiciones @Id_Torneo = @0',
            [idTorneo]
        );
    }

    async crear(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarPosicion @IdTorneo=@0, @IdParticipante=@1, @Puntos=@2, @PartidosJugados=@3, @PartidosGanados=@4, @PartidosPerdidos=@5',
            [
                dto.Id_Torneo,
                dto.Id_Participante,
                dto.Puntos ?? 0,
                dto.Partidos_Jugados ?? 0,
                dto.Partidos_Ganados ?? 0,
                dto.Partidos_Perdidos ?? 0
            ]
        );
    }

    async actualizar(id: number, dto: any) {
        return await this.dataSource.query(
            'EXEC sp_ActualizarPosicion @IdPosicion=@0, @Puntos=@1, @PartidosJugados=@2, @PartidosGanados=@3, @PartidosPerdidos=@4',
            [
                id,
                dto.Puntos,
                dto.Partidos_Jugados,
                dto.Partidos_Ganados,
                dto.Partidos_Perdidos
            ]
        );
    }

    async eliminar(id: number) {
        await this.dataSource.query(
            'EXEC sp_EliminarPosicion @IdPosicion = @0',
            [id]
        );
        return { success: true, message: `Registro de posición ${id} eliminado` };
    }
}