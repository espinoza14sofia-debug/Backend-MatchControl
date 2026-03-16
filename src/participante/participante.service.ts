// Importa decoradores y clases de NestJS
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// Importa la función para inyectar el DataSource de TypeORM
import { InjectDataSource } from '@nestjs/typeorm';
// Importa la clase DataSource de TypeORM
import { DataSource } from 'typeorm';

// Define el servicio de Participante
@Injectable()
export class ParticipanteService {
    
    // Constructor que inyecta el DataSource para ejecutar consultas SQL
    constructor(@InjectDataSource() private dataSource: DataSource) { }

    // Método para crear un participante
    async crear(dto: any) {
        try {
            // Sentencia SQL para insertar un nuevo participante
            const sql = `
                INSERT INTO Participante (Id_Torneo, Id_Usuario, Id_Equipo, Nombre_En_Torneo, Estado_Inscripcion) 
                VALUES (@0, @1, @2, @3, @4)
            `;

            // Ejecuta la consulta con los valores del DTO
            return await this.dataSource.query(sql, [
                dto.Id_Torneo,
                dto.Id_Usuario ?? null,
                dto.Id_Equipo ?? null,
                dto.Nombre_En_Torneo ?? 'Sin Nombre',
                dto.Estado_Inscripcion ?? 'Pendiente'
            ]);
        } catch (error) {
            // Manejo de error si el estado no es válido
            if (error.number === 547) {
                throw new HttpException(
                    'Estado no válido. Solo se permite: Aceptado, Rechazado o Pendiente',
                    HttpStatus.BAD_REQUEST
                );
            }
            throw error; // lanza otros errores
        }
    }

    // Método para obtener todos los participantes
    async findAll() {
        return await this.dataSource.query('SELECT * FROM Participante');
    }

    // Método para obtener un participante por su ID
    async findOne(id: number) {
        const res = await this.dataSource.query(
            'SELECT * FROM Participante WHERE Id_Participante = @0',
            [id]
        );
        return res[0]; // devuelve el primer resultado
    }

    // Método para actualizar un participante por su ID
    async actualizar(id: number, dto: any) {
        // Sentencia SQL para actualizar con ISNULL (mantiene valores si no se envían)
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

    // Método para eliminar un participante por su ID
    async eliminar(id: number) {
        return await this.dataSource.query(
            'DELETE FROM Participante WHERE Id_Participante = @0',
            [id]
        );
    }
}