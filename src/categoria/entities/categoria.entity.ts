import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Esta entidad representa la tabla Categoria en la base de datos
@Entity('Categoria')
export class Categoria {

  // Id único de la categoría
  @PrimaryGeneratedColumn()
  Id_Categoria: number;

  // Nombre de la categoría (debe ser único)
  @Column({ unique: true, length: 50 })
  Nombre: string;

  // Descripción de la categoría (puede ser nula)
  @Column({ length: 200, nullable: true })
  Descripcion: string;
}