import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ParticipanteService {

    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async crear(dto: any) {
        try {
            return await this.dataSource.query(
                'EXEC sp_InscribirParticipante @IdTorneo=@0, @IdUsuario=@1, @IdEquipo=@2, @Nombre=@3',
                [
                    dto.Id_Torneo,
                    dto.Id_Usuario ?? null,
                    dto.Id_Equipo ?? null,
                    dto.Nombre_En_Torneo ?? 'Sin Nombre'
                ]
            );
        } catch (error) {
            throw new HttpException(
                error.message || 'Error al inscribir al participante',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async findAll() {
        return await this.dataSource.query(`
            SELECT 
                p.*, 
                t.Nombre AS Nombre_Torneo,
                u.Nickname AS Nickname_Usuario,
                e.Nombre AS Nombre_Equipo
            FROM Participante p
            INNER JOIN Torneo t ON p.Id_Torneo = t.Id_Torneo
            LEFT JOIN Usuario u ON p.Id_Usuario = u.Id_Usuario
            LEFT JOIN Equipo e ON p.Id_Equipo = e.Id_Equipo
            ORDER BY p.Fecha_Registro DESC
        `);
    }

    async findOne(id: number) {
        const res = await this.dataSource.query(
            'SELECT * FROM Participante WHERE Id_Participante = @0',
            [id]
        );
        if (!res || res.length === 0) throw new NotFoundException(`Participante ${id} no encontrado`);
        return res[0];
    }

    async actualizar(id: number, dto: any) {
        await this.findOne(id);
        
        await this.dataSource.query(
            'EXEC sp_ActualizarInscripcion @IdParticipante=@0, @Estado=@1',
            [id, dto.Estado_Inscripcion]
        );

        return { success: true, message: `Participante ${id} actualizado` };
    }

    async eliminar(id: number) {
        await this.findOne(id);
        await this.dataSource.query(
            'EXEC sp_EliminarParticipante @IdParticipante = @0',
            [id]
        );
        return { success: true, message: 'Participante eliminado correctamente' };
    }
}