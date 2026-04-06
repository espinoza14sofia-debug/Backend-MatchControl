import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class OrganizacionService {

  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }


  async create(dto: any) {
    return await this.dataSource.query(
      'EXEC sp_InsertarOrganizacion @Nombre=@0, @Email=@1, @Telefono=@2',
      [dto.nombre, dto.email ?? null, dto.telefono ?? null]
    );
  }


  async findAll() {
    const result = await this.dataSource.query('EXEC sp_ObtenerOrganizacion');
    return { success: true, data: result };
  }


  async findOne(id: number) {
    const result = await this.dataSource.query(
      'EXEC sp_ObtenerOrganizacion @IdOrganizacion=@0', [id]
    );
    if (!result || result.length === 0)
      throw new NotFoundException(`Organización con ID ${id} no encontrada`);
    return { success: true, data: result[0] };
  }


  async update(id: number, dto: any) {
    await this.dataSource.query(
      'EXEC sp_ActualizarOrganizacion @IdOrganizacion=@0, @Nombre=@1, @Email=@2, @Telefono=@3',
      [id, dto.nombre, dto.email ?? null, dto.telefono ?? null]
    );
    return { success: true, message: `Organización ${id} actualizada` };
  }

  async remove(id: number) {
    await this.dataSource.query(
      'EXEC sp_EliminarOrganizacion @IdOrganizacion=@0', [id]
    );
    return { success: true, message: `Organización ${id} desactivada` };
  }
}