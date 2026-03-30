import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class FaseService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

  async crear(dto: any) {
    const sql = `
      EXEC sp_InsertarFase 
        @IdTorneo = @0, 
        @Nombre = @1, 
        @Orden = @2, 
        @TipoFase = @3
    `;

    const values = [
      dto.Id_Torneo,
      dto.Nombre,
      dto.Orden,
      dto.Tipo_Fase
    ];

    return await this.dataSource.query(sql, values);
  }

  async findAll() {
    return await this.dataSource.query('SELECT * FROM Fase ORDER BY Id_Torneo, Orden ASC');
  }

  async findOne(id: number) {
    const result = await this.dataSource.query('SELECT * FROM Fase WHERE Id_Fase = @0', [id]);
    if (!result[0]) throw new NotFoundException(`Fase ${id} no encontrada`);
    return result[0];
  }

  async findByTorneo(idTorneo: number) {
    return await this.dataSource.query('SELECT * FROM Fase WHERE Id_Torneo = @0 ORDER BY Orden ASC', [idTorneo]);
  }

  async actualizar(id: number, dto: any) {
    return await this.dataSource.query(
      'EXEC sp_ActualizarFase @IdFase=@0, @Nombre=@1, @Orden=@2, @TipoFase=@3',
      [id, dto.Nombre, dto.Orden, dto.Tipo_Fase]
    );
  }

  async eliminar(id: number) {
    await this.dataSource.query('EXEC sp_EliminarFase @IdFase=@0', [id]);
    return { success: true, message: `Fase ${id} eliminada` };
  }
}