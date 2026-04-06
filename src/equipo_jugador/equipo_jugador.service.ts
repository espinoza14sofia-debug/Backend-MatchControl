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
      if (error.number === 2627 || error.number === 50040)
        throw new HttpException('El jugador ya está en este equipo', HttpStatus.BAD_REQUEST);
      throw error;
    }
  }


  async obtenerMiembros(idEquipo: number) {
    return await this.dataSource.query(
      'EXEC sp_ObtenerJugadoresEquipo @IdEquipo=@0', [idEquipo]
    );
  }

  async findAll() {
    return await this.dataSource.query('SELECT * FROM Equipo_Jugador');
  }


  async actualizarCapitan(idEquipo: number, idNuevoCapitan: number) {
    return await this.dataSource.query(
      'EXEC sp_ActualizarJugadorEquipo @IdEquipo=@0, @IdNuevoCapitan=@1',
      [idEquipo, idNuevoCapitan]
    );
  }


  async eliminar(idEquipo: number, idUsuario: number) {
    await this.dataSource.query(
      'EXEC sp_EliminarJugadorEquipo @IdEquipo=@0, @IdUsuario=@1',
      [idEquipo, idUsuario]
    );
    return { success: true, message: 'Jugador eliminado del equipo' };
  }
}