import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ConfiguracionSistemaService {
  constructor(@InjectDataSource() private dataSource: DataSource) { }

  async findAll() {

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

  async findOne(id: number) {


    const config = await this.dataSource.query(
      'SELECT * FROM Configuracion_Sistema WHERE Id_Config = @0',
      [id]
    );


    if (!config[0]) {
      throw new NotFoundException(`Engineer, la configuración con ID ${id} no existe`);
    }

    return { success: true, data: config[0] };
  }

  async findByClave(clave: string) {


    const config = await this.dataSource.query(
      'SELECT * FROM Configuracion_Sistema WHERE Clave = @0',
      [clave]
    );

    return { success: true, data: config[0] || null };
  }


  async create(dto: any) {


    await this.dataSource.query(
      'INSERT INTO Configuracion_Sistema (Clave, Valor, Descripcion) VALUES (@0, @1, @2)',
      [dto.Clave, dto.Valor, dto.Descripcion]
    );

    return {
      success: true,
      message: 'Engineer, configuración global creada exitosamente'
    };
  }


  async update(id: number, dto: any) {


    const existe = await this.findOne(id);


    await this.dataSource.query(
      'UPDATE Configuracion_Sistema SET Valor = @0, Descripcion = @1 WHERE Id_Config = @2',
      [dto.Valor, dto.Descripcion, id]
    );

    return {
      success: true,
      message: `Engineer, la clave [${existe.data.Clave}] ha sido actualizada`
    };
  }


  async remove(id: number) {


    await this.dataSource.query(
      'DELETE FROM Configuracion_Sistema WHERE Id_Config = @0',
      [id]
    );

    return { success: true, message: 'Configuración eliminada correctamente' };
  }
}