import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class EquipoJugadorService {


  constructor(@InjectDataSource() private dataSource: DataSource) { }
  async agregarJugador(dto: any) {
    try {

      const sql = `INSERT INTO Equipo_Jugador (Id_Equipo, Id_Usuario) VALUES (@0, @1)`;

      await this.dataSource.query(sql, [dto.Id_Equipo, dto.Id_Usuario]);

      return { success: true, message: 'Jugador añadido al equipo' };

    } catch (error) {

      if (error.number === 2627)
        throw new HttpException('El jugador ya está en este equipo', HttpStatus.BAD_REQUEST);

      throw error;
    }
  }


  async findAll() {

    return await this.dataSource.query('SELECT * FROM Equipo_Jugador');
  }


  async obtenerMiembros(idEquipo: number) {

    const sql = `
      SELECT EJ.Id_Equipo, U.Id_Usuario, U.Nombre_Completo, U.Nickname, EJ.Fecha_Union
      FROM Equipo_Jugador EJ
      JOIN Usuario U ON EJ.Id_Usuario = U.Id_Usuario
      WHERE EJ.Id_Equipo = @0
    `;

    return await this.dataSource.query(sql, [idEquipo]);
  }


  async actualizar(idEquipoAntiguo: number, idUsuario: number, nuevoIdEquipo: number) {


    const sql = `
      UPDATE Equipo_Jugador 
      SET Id_Equipo = @2 
      WHERE Id_Equipo = @0 AND Id_Usuario = @1
    `;

    await this.dataSource.query(sql, [idEquipoAntiguo, idUsuario, nuevoIdEquipo]);

    return { success: true, message: 'Jugador movido de equipo correctamente' };
  }


  async eliminar(idEquipo: number, idUsuario: number) {


    const sql = `DELETE FROM Equipo_Jugador WHERE Id_Equipo = @0 AND Id_Usuario = @1`;

    await this.dataSource.query(sql, [idEquipo, idUsuario]);

    return { success: true, message: 'Jugador eliminado del equipo' };
  }
}