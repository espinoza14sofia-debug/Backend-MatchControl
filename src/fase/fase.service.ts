import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class FaseService {
  constructor(@InjectDataSource() private dataSource: DataSource) { }
  async crear(dto: any) {
    const sql = `
      EXEC sp_InsertarFase 
        @IdTorneo = @0, 
        @NombreFase = @1, 
        @Orden = @2, 
        @TipoFase = @3
    `;

    const values = [
      parseInt(dto.Id_Torneo),
      dto.Nombre ? String(dto.Nombre) : "Fase Nueva",
      parseInt(dto.Orden) || 1,
      dto.Tipo_Fase ? String(dto.Tipo_Fase) : null
    ];

    return await this.dataSource.query(sql, values);
  }

  async findAll() {
    return await this.dataSource.query('SELECT * FROM Fase ORDER BY Id_Torneo, Orden ASC');
  }

  async findOne(id: number) {
    const result = await this.dataSource.query('SELECT * FROM Fase WHERE Id_Fase = @0', [id]);

    return result[0];
  }


  async findByTorneo(idTorneo: number) {


    return await this.dataSource.query('SELECT * FROM Fase WHERE Id_Torneo = @0 ORDER BY Orden ASC', [idTorneo]);
  }

  async actualizar(id: number, dto: any) {


    const sql = `
      UPDATE Fase 
      SET Nombre = ISNULL(@1, Nombre), 
          Orden = ISNULL(@2, Orden),
          Tipo_Fase = ISNULL(@3, Tipo_Fase)
      WHERE Id_Fase = @0
    `;

    return await this.dataSource.query(sql, [
      id,
      dto.Nombre,
      dto.Orden,
      dto.Tipo_Fase
    ]);
  }


  async eliminar(id: number) {


    await this.dataSource.query('DELETE FROM Fase WHERE Id_Fase = @0', [id]);

    return { success: true, message: `Fase ${id} eliminada` };
  }
}