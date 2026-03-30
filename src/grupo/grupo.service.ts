import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class GrupoService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

  async crear(dto: any) {
    const sql = `EXEC sp_InsertarGrupo @IdFase = @0, @Nombre = @1`;
    const values = [
      dto.Id_Fase,
      dto.Nombre || "Grupo Nuevo"
    ];

    return await this.dataSource.query(sql, values);
  }

  async findAll() {
    return await this.dataSource.query('SELECT * FROM Grupo ORDER BY Id_Fase ASC');
  }

  async findOne(id: number) {
    const result = await this.dataSource.query('SELECT * FROM Grupo WHERE Id_Grupo = @0', [id]);
    if (!result[0]) throw new NotFoundException(`Grupo ${id} no encontrado`);
    return result[0];
  }

  async findByFase(idFase: number) {
    return await this.dataSource.query('SELECT * FROM Grupo WHERE Id_Fase = @0', [idFase]);
  }

  async actualizar(id: number, dto: any) {
    await this.findOne(id);
    
    return await this.dataSource.query(
      'EXEC sp_ActualizarGrupo @IdGrupo=@0, @Nombre=@1, @IdFase=@2',
      [id, dto.Nombre, dto.Id_Fase]
    );
  }

  async eliminar(id: number) {
    await this.dataSource.query('EXEC sp_EliminarGrupo @IdGrupo=@0', [id]);

    return { success: true, message: `Grupo ${id} eliminado correctamente` };
  }
}