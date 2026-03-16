import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Servicio que maneja la lógica de los jugadores dentro de los equipos
@Injectable()
export class EquipoJugadorService {

  // Se inyecta la conexión a la base de datos
  constructor(@InjectDataSource() private dataSource: DataSource) { }

  // Método para agregar un jugador a un equipo
  async agregarJugador(dto: any) {
    try {

      // Inserta un registro en la tabla Equipo_Jugador
      const sql = `INSERT INTO Equipo_Jugador (Id_Equipo, Id_Usuario) VALUES (@0, @1)`;

      await this.dataSource.query(sql, [dto.Id_Equipo, dto.Id_Usuario]);

      return { success: true, message: 'Jugador añadido al equipo' };

    } catch (error) {

      // Error cuando el jugador ya pertenece a ese equipo
      if (error.number === 2627)
        throw new HttpException('El jugador ya está en este equipo', HttpStatus.BAD_REQUEST);

      throw error;
    }
  }

  // Método para obtener todas las relaciones equipo-jugador
  async findAll() {

    // Consulta todos los registros de la tabla
    return await this.dataSource.query('SELECT * FROM Equipo_Jugador');
  }

  // Método para obtener todos los miembros de un equipo
  async obtenerMiembros(idEquipo: number) {

    // Consulta que une la tabla Equipo_Jugador con Usuario
    // para obtener información del jugador
    const sql = `
      SELECT EJ.Id_Equipo, U.Id_Usuario, U.Nombre_Completo, U.Nickname, EJ.Fecha_Union
      FROM Equipo_Jugador EJ
      JOIN Usuario U ON EJ.Id_Usuario = U.Id_Usuario
      WHERE EJ.Id_Equipo = @0
    `;

    return await this.dataSource.query(sql, [idEquipo]);
  }

  // Método para mover un jugador de un equipo a otro
  async actualizar(idEquipoAntiguo: number, idUsuario: number, nuevoIdEquipo: number) {

    // Actualiza el equipo al que pertenece el jugador
    const sql = `
      UPDATE Equipo_Jugador 
      SET Id_Equipo = @2 
      WHERE Id_Equipo = @0 AND Id_Usuario = @1
    `;

    await this.dataSource.query(sql, [idEquipoAntiguo, idUsuario, nuevoIdEquipo]);

    return { success: true, message: 'Jugador movido de equipo correctamente' };
  }

  // Método para eliminar un jugador de un equipo
  async eliminar(idEquipo: number, idUsuario: number) {

    // Elimina el registro de la tabla
    const sql = `DELETE FROM Equipo_Jugador WHERE Id_Equipo = @0 AND Id_Usuario = @1`;

    await this.dataSource.query(sql, [idEquipo, idUsuario]);

    return { success: true, message: 'Jugador eliminado del equipo' };
  }
}