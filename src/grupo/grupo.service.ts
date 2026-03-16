import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class GrupoService {
  constructor(@InjectDataSource() private dataSource: DataSource) { }
  async crear(dto: any) {


    const sql = `EXEC sp_InsertarGrupo @IdFase = @0, @NombreGrupo = @1`;
    const values = [
      parseInt(dto.Id_Fase),
      dto.Nombre ? String(dto.Nombre) : "Grupo Nuevo"
    ];

    return await this.dataSource.query(sql, values);
  }
  async findAll() {

    return await this.dataSource.query('SELECT * FROM Grupo ORDER BY Id_Fase ASC');
  }

  async findOne(id: number) {


    const result = await this.dataSource.query('SELECT * FROM Grupo WHERE Id_Grupo = @0', [id]);

    return result[0];
  }
  async findByFase(idFase: number) {

    return await this.dataSource.query('SELECT * FROM Grupo WHERE Id_Fase = @0', [idFase]);
  }

  async actualizar(id: number, dto: any) {

    const sql = `
      UPDATE Grupo 
      SET Nombre = ISNULL(@1, Nombre), 
          Id_Fase = ISNULL(@2, Id_Fase)
      WHERE Id_Grupo = @0
    `;

    await this.dataSource.query(sql, [id, dto.Nombre, dto.Id_Fase]);

    return { success: true, message: `Grupo ${id} actualizado correctamente` };
  }

  async eliminar(id: number) {

    const sql = `DELETE FROM Grupo WHERE Id_Grupo = @0`;

    await this.dataSource.query(sql, [id]);

    return { success: true, message: `Grupo ${id} eliminado correctamente` };
  }
}