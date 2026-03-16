
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ParticipanteService {


    constructor(@InjectDataSource() private dataSource: DataSource) { }


    async crear(dto: any) {
        try {

            const sql = `
                INSERT INTO Participante (Id_Torneo, Id_Usuario, Id_Equipo, Nombre_En_Torneo, Estado_Inscripcion) 
                VALUES (@0, @1, @2, @3, @4)
            `;


            return await this.dataSource.query(sql, [
                dto.Id_Torneo,
                dto.Id_Usuario ?? null,
                dto.Id_Equipo ?? null,
                dto.Nombre_En_Torneo ?? 'Sin Nombre',
                dto.Estado_Inscripcion ?? 'Pendiente'
            ]);
        } catch (error) {

            if (error.number === 547) {
                throw new HttpException(
                    'Estado no válido. Solo se permite: Aceptado, Rechazado o Pendiente',
                    HttpStatus.BAD_REQUEST
                );
            }
            throw error;
        }
    }


    async findAll() {
        return await this.dataSource.query('SELECT * FROM Participante');
    }


    async findOne(id: number) {
        const res = await this.dataSource.query(
            'SELECT * FROM Participante WHERE Id_Participante = @0',
            [id]
        );
        return res[0];
    }


    async actualizar(id: number, dto: any) {

        const sql = `
            UPDATE Participante 
            SET Id_Torneo = ISNULL(@1, Id_Torneo), 
                Id_Usuario = ISNULL(@2, Id_Usuario),
                Id_Equipo = ISNULL(@3, Id_Equipo),
                Nombre_En_Torneo = ISNULL(@4, Nombre_En_Torneo),
                Estado_Inscripcion = ISNULL(@5, Estado_Inscripcion)
            WHERE Id_Participante = @0
        `;
        return await this.dataSource.query(sql, [
            id, dto.Id_Torneo, dto.Id_Usuario, dto.Id_Equipo, dto.Nombre_En_Torneo, dto.Estado_Inscripcion
        ]);
    }


    async eliminar(id: number) {
        return await this.dataSource.query(
            'DELETE FROM Participante WHERE Id_Participante = @0',
            [id]
        );
    }
}