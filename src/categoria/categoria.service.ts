import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CategoriaService {

  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

  async crear(dto: any) {
    await this.dataSource.query(
      'EXEC sp_InsertarCategoria @Nombre=@0, @Descripcion=@1',
      [dto.nombre, dto.descripcion ?? null]   // ← minúscula
    );
    return { success: true, message: 'Categoría creada con éxito' };
  }

  async findAll() {
    const categorias = await this.dataSource.query('SELECT * FROM Categoria');
    return { success: true, data: categorias };
  }

  async findOne(id: number) {
    const categoria = await this.dataSource.query(
      'SELECT * FROM Categoria WHERE Id_Categoria = @0', [id]
    );
    if (!categoria[0]) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return { success: true, data: categoria[0] };
  }

  async actualizar(id: number, dto: any) {
    await this.dataSource.query(
      'EXEC sp_ActualizarCategoria @IdCategoria=@0, @Nombre=@1, @Descripcion=@2',
      [id, dto.nombre, dto.descripcion ?? null]   // ← minúscula, sin findOne previo
    );
    return { success: true, message: 'Categoría actualizada con éxito' };
  }

  async eliminar(id: number) {
    try {
      await this.dataSource.query(
        'EXEC sp_EliminarCategoria @IdCategoria=@0', [id]  // ← sin espacio antes de @0
      );
      return { success: true, message: `Categoría ${id} eliminada` };
    } catch (error: any) {
      throw new NotFoundException(error.message || 'No se puede eliminar, puede tener disciplinas asociadas');
    }
  }
}