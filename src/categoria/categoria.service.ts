import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Servicio donde está la lógica para manejar las categorías
@Injectable()
export class CategoriaService {

  // Se inyecta la conexión a la base de datos
  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

  // Método para crear una nueva categoría
  async crear(dto: any) {

    // Inserta la categoría en la tabla Categoria
    await this.dataSource.query(
      'INSERT INTO Categoria (Nombre, Descripcion) VALUES (@0, @1)',
      [dto.Nombre, dto.Descripcion]
    );

    // Mensaje de confirmación
    return { success: true, message: 'Categoría creada con éxito ' };
  }

  // Método para obtener todas las categorías
  async findAll() {

    // Consulta todas las categorías de la tabla
    const categorias = await this.dataSource.query('SELECT * FROM Categoria');

    return { success: true, data: categorias };
  }

  // Método para buscar una categoría por su id
  async findOne(id: number) {

    // Consulta la categoría según el id
    const categoria = await this.dataSource.query(
      'SELECT * FROM Categoria WHERE Id_Categoria = @0',
      [id]
    );

    // Si no existe la categoría se lanza un error
    if (!categoria[0]) {
      throw new NotFoundException(` La categoría con ID ${id} no existe`);
    }

    return { success: true, data: categoria[0] };
  }

  // Método para eliminar una categoría
  async eliminar(id: number) {

    // Primero se verifica que la categoría exista
    await this.findOne(id);

    // Se elimina la categoría de la tabla
    await this.dataSource.query(
      'DELETE FROM Categoria WHERE Id_Categoria = @0',
      [id]
    );

    // Mensaje de confirmación
    return { success: true, message: `Categoría ${id} eliminada correctamente` };
  }
}