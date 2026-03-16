import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Servicio que contiene la lógica para manejar las fases de los torneos
@Injectable()
export class FaseService {

  // Se inyecta la conexión a la base de datos
  constructor(@InjectDataSource() private dataSource: DataSource) { }

  // Método para crear una nueva fase
  async crear(dto: any) {

    // Se ejecuta un procedimiento almacenado para insertar la fase
    const sql = `
      EXEC sp_InsertarFase 
        @IdTorneo = @0, 
        @NombreFase = @1, 
        @Orden = @2, 
        @TipoFase = @3
    `;

    // Valores que se enviarán al procedimiento
    const values = [
      parseInt(dto.Id_Torneo),
      dto.Nombre ? String(dto.Nombre) : "Fase Nueva",
      parseInt(dto.Orden) || 1,
      dto.Tipo_Fase ? String(dto.Tipo_Fase) : null
    ];

    return await this.dataSource.query(sql, values);
  }

  // Método para obtener todas las fases
  async findAll() {

    // Consulta todas las fases ordenadas por torneo y orden
    return await this.dataSource.query('SELECT * FROM Fase ORDER BY Id_Torneo, Orden ASC');
  }

  // Método para obtener una fase por su id
  async findOne(id: number) {

    // Consulta la fase según el id
    const result = await this.dataSource.query('SELECT * FROM Fase WHERE Id_Fase = @0', [id]);

    return result[0];
  }

  // Método para obtener todas las fases de un torneo específico
  async findByTorneo(idTorneo: number) {

    // Consulta las fases del torneo ordenadas por el orden de juego
    return await this.dataSource.query('SELECT * FROM Fase WHERE Id_Torneo = @0 ORDER BY Orden ASC', [idTorneo]);
  }

  // Método para actualizar una fase
  async actualizar(id: number, dto: any) {

    // Consulta para actualizar los datos de la fase
    // ISNULL permite mantener el valor actual si no se envía uno nuevo
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

  // Método para eliminar una fase
  async eliminar(id: number) {

    // Elimina la fase según su id
    await this.dataSource.query('DELETE FROM Fase WHERE Id_Fase = @0', [id]);

    return { success: true, message: `Fase ${id} eliminada` };
  }
}