import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Servicio que maneja la lógica de los grupos
@Injectable()
export class GrupoService {

  // Se inyecta la conexión a la base de datos
  constructor(@InjectDataSource() private dataSource: DataSource) { }

  // Método para crear un nuevo grupo
  async crear(dto: any) {

    // Se ejecuta un procedimiento almacenado para insertar el grupo
    const sql = `EXEC sp_InsertarGrupo @IdFase = @0, @NombreGrupo = @1`;

    // Valores que se enviarán al procedimiento
    const values = [
      parseInt(dto.Id_Fase),
      dto.Nombre ? String(dto.Nombre) : "Grupo Nuevo"
    ];

    return await this.dataSource.query(sql, values);
  }

  // Método para obtener todos los grupos
  async findAll() {

    // Consulta todos los grupos ordenados por la fase
    return await this.dataSource.query('SELECT * FROM Grupo ORDER BY Id_Fase ASC');
  }

  // Método para obtener un grupo por su id
  async findOne(id: number) {

    // Consulta el grupo según su id
    const result = await this.dataSource.query('SELECT * FROM Grupo WHERE Id_Grupo = @0', [id]);

    return result[0];
  }

  // Método para obtener los grupos que pertenecen a una fase
  async findByFase(idFase: number) {

    // Consulta los grupos según el id de la fase
    return await this.dataSource.query('SELECT * FROM Grupo WHERE Id_Fase = @0', [idFase]);
  }

  // Método para actualizar los datos de un grupo
  async actualizar(id: number, dto: any) {

    // Consulta para actualizar el grupo
    // ISNULL permite mantener el valor actual si no se envía uno nuevo
    const sql = `
      UPDATE Grupo 
      SET Nombre = ISNULL(@1, Nombre), 
          Id_Fase = ISNULL(@2, Id_Fase)
      WHERE Id_Grupo = @0
    `;

    await this.dataSource.query(sql, [id, dto.Nombre, dto.Id_Fase]);

    return { success: true, message: `Grupo ${id} actualizado correctamente` };
  }

  // Método para eliminar un grupo
  async eliminar(id: number) {

    // Elimina el grupo según su id
    const sql = `DELETE FROM Grupo WHERE Id_Grupo = @0`;

    await this.dataSource.query(sql, [id]);

    return { success: true, message: `Grupo ${id} eliminado correctamente` };
  }
}