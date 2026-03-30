import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class EquipoJugadorService {

  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

  async agregarJugador(dto: any) {
    try {
      return await this.dataSource.query(
        'EXEC sp_AgregarJugadorEquipo @IdEquipo=@0, @IdUsuario=@1',
        [dto.Id_Equipo, dto.Id_Usuario]
      );
    } catch (error) {
      if (error.number === 2627 || error.number === 50000)
        throw new HttpException('El jugador ya está en este equipo o no existe', HttpStatus.BAD_REQUEST);
      throw error;
    }
  }

  // ESTE ES EL MÉTODO QUE FALTABA PARA QUITAR EL ERROR
  async actualizar(idEq: number, idUs: number, nuevoIdEq: number) {
    try {
      const sql = `
        UPDATE Equipo_Jugador 
        SET Id_Equipo = @2 
        WHERE Id_Equipo = @0 AND Id_Usuario = @1
      `;

      const resultado = await this.dataSource.query(sql, [idEq, idUs, nuevoIdEq]);

      // Si no afectó ninguna fila, es porque la relación no existía
      if (resultado[1] === 0) {
        throw new NotFoundException('No se encontró la relación Jugador-Equipo para actualizar');
      }

      return { success: true, message: 'Jugador movido de equipo correctamente' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al actualizar el equipo del jugador',
        HttpStatus.BAD_REQUEST
      );
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

  async eliminar(idEquipo: number, idUsuario: number) {
    await this.dataSource.query(
      'EXEC sp_EliminarJugadorEquipo @IdEquipo=@0, @IdUsuario=@1',
      [idEquipo, idUsuario]
    );

    return { success: true, message: 'Jugador eliminado del equipo' };
  }
}