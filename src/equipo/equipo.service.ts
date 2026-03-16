import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Servicio que contiene la lógica para manejar los equipos
@Injectable()
export class EquipoService {

    // Se inyecta la conexión a la base de datos
    constructor(@InjectDataSource() private dataSource: DataSource) { }

    // Método para crear un nuevo equipo
    async crear(dto: any) {

        // Consulta SQL para insertar un equipo
        const sql = `  INSERT INTO Equipo (Id_Capitan, Nombre, Siglas, Logo_URL) VALUES (@0, @1, @2, @3)`;

        // Ejecuta la consulta con los datos recibidos
        return await this.dataSource.query(sql, [
            dto.Id_Capitan,
            dto.Nombre,
            dto.Siglas,
            dto.Logo_URL
        ]);
    }

    // Método para obtener todos los equipos
    async findAll() {

        // Consulta todos los equipos ordenados por el id de forma descendente
        return await this.dataSource.query('SELECT * FROM Equipo ORDER BY Id_Equipo DESC');
    }

    // Método para buscar un equipo por su id
    async findOne(id: number) {

        // Consulta el equipo según el id
        const result = await this.dataSource.query('SELECT * FROM Equipo WHERE Id_Equipo = @0', [id]);

        // Si no existe el equipo se lanza un error
        if (!result[0]) {
            throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
        }

        return result[0];
    }

    // Método para actualizar los datos de un equipo
    async actualizar(id: number, dto: any) {
        try {

            // Consulta para actualizar el equipo
            // ISNULL permite que si no se envía un dato se mantenga el valor actual
            const sql = `
        UPDATE Equipo 
        SET Nombre = ISNULL(@1, Nombre), 
            Siglas = ISNULL(@2, Siglas), 
            Logo_URL = ISNULL(@3, Logo_URL)
        WHERE Id_Equipo = @0`;

            const result = await this.dataSource.query(sql, [id, dto.Nombre, dto.Siglas, dto.Logo_URL]);

            return { success: true, message: `Equipo ${id} actualizado correctamente` };

        } catch (error) {

            // Manejo de error si ocurre algún problema al actualizar
            throw new HttpException('Error al actualizar el equipo: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Método para eliminar un equipo
    async eliminar(id: number) {
        try {

            // Elimina el equipo según el id
            await this.dataSource.query('DELETE FROM Equipo WHERE Id_Equipo = @0', [id]);

            return { success: true, message: `Equipo ${id} eliminado correctamente` };

        } catch (error) {

            // Error cuando el equipo está relacionado con otros registros
            if (error.number === 547) {
                throw new HttpException(
                    'No se puede eliminar: El equipo tiene jugadores asignados o está inscrito en un torneo.',
                    HttpStatus.CONFLICT
                );
            }

            // Otro tipo de error
            throw new HttpException('Error al eliminar: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}