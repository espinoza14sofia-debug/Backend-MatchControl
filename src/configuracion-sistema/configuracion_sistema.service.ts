import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Servicio que maneja la lógica de la configuración del sistema
@Injectable()
export class ConfiguracionSistemaService {

  // Se inyecta la conexión a la base de datos
  constructor(@InjectDataSource() private dataSource: DataSource) { }

  // Método para obtener todas las configuraciones del sistema
  async findAll() {

    // Consulta que trae los campos principales de la tabla
    const configs = await this.dataSource.query(`
      SELECT 
        Id_Config, 
        Clave, 
        Valor, 
        Descripcion 
      FROM Configuracion_Sistema
    `);

    return { success: true, data: configs };
  }

  // Método para buscar una configuración por su id
  async findOne(id: number) {

    // Consulta la configuración según el id
    const config = await this.dataSource.query(
      'SELECT * FROM Configuracion_Sistema WHERE Id_Config = @0',
      [id]
    );

    // Si no existe se lanza un error
    if (!config[0]) {
      throw new NotFoundException(`Engineer, la configuración con ID ${id} no existe`);
    }

    return { success: true, data: config[0] };
  }

  // Método para buscar una configuración usando la clave
  async findByClave(clave: string) {

    // Busca la configuración según la clave
    const config = await this.dataSource.query(
      'SELECT * FROM Configuracion_Sistema WHERE Clave = @0',
      [clave]
    );

    return { success: true, data: config[0] || null };
  }

  // Método para crear una nueva configuración
  async create(dto: any) {

    // Inserta un nuevo registro en la tabla
    await this.dataSource.query(
      'INSERT INTO Configuracion_Sistema (Clave, Valor, Descripcion) VALUES (@0, @1, @2)',
      [dto.Clave, dto.Valor, dto.Descripcion]
    );

    return {
      success: true,
      message: 'Engineer, configuración global creada exitosamente'
    };
  }

  // Método para actualizar una configuración existente
  async update(id: number, dto: any) {

    // Primero verifica que la configuración exista
    const existe = await this.findOne(id);

    // Actualiza el valor y la descripción
    await this.dataSource.query(
      'UPDATE Configuracion_Sistema SET Valor = @0, Descripcion = @1 WHERE Id_Config = @2',
      [dto.Valor, dto.Descripcion, id]
    );

    return {
      success: true,
      message: `Engineer, la clave [${existe.data.Clave}] ha sido actualizada`
    };
  }

  // Método para eliminar una configuración
  async remove(id: number) {

    // Elimina el registro según el id
    await this.dataSource.query(
      'DELETE FROM Configuracion_Sistema WHERE Id_Config = @0',
      [id]
    );

    return { success: true, message: 'Configuración eliminada correctamente' };
  }
}