import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


@Injectable()
export class CategoriaService {


  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }
  async crear(dto: any) {

    await this.dataSource.query(
      'INSERT INTO Categoria (Nombre, Descripcion) VALUES (@0, @1)',
      [dto.Nombre, dto.Descripcion]
    );

    return { success: true, message: 'Categoría creada con éxito ' };
  }

  async findAll() {

    const categorias = await this.dataSource.query('SELECT * FROM Categoria');

    return { success: true, data: categorias };
  }

  async findOne(id: number) {

    const categoria = await this.dataSource.query(
      'SELECT * FROM Categoria WHERE Id_Categoria = @0',
      [id]
    );

    if (!categoria[0]) {
      throw new NotFoundException(` La categoría con ID ${id} no existe`);
    }

    return { success: true, data: categoria[0] };
  }

  async eliminar(id: number) {

    await this.findOne(id);


    await this.dataSource.query(
      'DELETE FROM Categoria WHERE Id_Categoria = @0',
      [id]
    );


    return { success: true, message: `Categoría ${id} eliminada correctamente` };
  }
}