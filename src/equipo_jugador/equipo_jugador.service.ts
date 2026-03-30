import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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