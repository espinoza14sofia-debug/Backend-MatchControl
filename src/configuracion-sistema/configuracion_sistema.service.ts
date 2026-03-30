import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ConfiguracionSistemaService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

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
      throw new NotFoundException(`La configuración con ID ${id} no existe`);
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
      'EXEC sp_InsertarConfiguracion @Clave=@0, @Valor=@1, @Descripcion=@2',
      [dto.Clave, dto.Valor, dto.Descripcion ?? null]
    );

    return {
      success: true,
      message: 'Configuración global creada exitosamente'
    };
  }

  async update(id: number, dto: any) {
    const existe = await this.findOne(id);

    await this.dataSource.query(
      'EXEC sp_ActualizarConfiguracion @IdConfig=@0, @Valor=@1, @Descripcion=@2',
      [id, dto.Valor, dto.Descripcion ?? null]
    );

    return {
      success: true,
      message: `La clave [${existe.data.Clave}] ha sido actualizada`
    };
  }

  async remove(id: number) {
    await this.dataSource.query(
      'EXEC sp_EliminarConfiguracion @IdConfig=@0',
      [id]
    );

    return { success: true, message: 'Configuración eliminada correctamente' };
  }
}