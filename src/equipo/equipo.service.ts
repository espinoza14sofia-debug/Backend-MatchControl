import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class EquipoService {

    constructor(@InjectDataSource() private dataSource: DataSource) { }


    async crear(dto: any) {

        const sql = `  INSERT INTO Equipo (Id_Capitan, Nombre, Siglas, Logo_URL) VALUES (@0, @1, @2, @3)`;

        return await this.dataSource.query(sql, [
            dto.Id_Capitan,
            dto.Nombre,
            dto.Siglas,
            dto.Logo_URL
        ]);
    }

    async findAll() {


        return await this.dataSource.query('SELECT * FROM Equipo ORDER BY Id_Equipo DESC');
    }


    async findOne(id: number) {


        const result = await this.dataSource.query('SELECT * FROM Equipo WHERE Id_Equipo = @0', [id]);


        if (!result[0]) {
            throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
        }

        return result[0];
    }


    async actualizar(id: number, dto: any) {
        try {


            const sql = `
        UPDATE Equipo 
        SET Nombre = ISNULL(@1, Nombre), 
            Siglas = ISNULL(@2, Siglas), 
            Logo_URL = ISNULL(@3, Logo_URL)
        WHERE Id_Equipo = @0`;

            const result = await this.dataSource.query(sql, [id, dto.Nombre, dto.Siglas, dto.Logo_URL]);

            return { success: true, message: `Equipo ${id} actualizado correctamente` };

        } catch (error) {


            throw new HttpException('Error al actualizar el equipo: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async eliminar(id: number) {
        try {

            await this.dataSource.query('DELETE FROM Equipo WHERE Id_Equipo = @0', [id]);

            return { success: true, message: `Equipo ${id} eliminado correctamente` };

        } catch (error) {

            if (error.number === 547) {
                throw new HttpException(
                    'No se puede eliminar: El equipo tiene jugadores asignados o está inscrito en un torneo.',
                    HttpStatus.CONFLICT
                );
            }


            throw new HttpException('Error al eliminar: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}