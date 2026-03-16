import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Categoria')
export class Categoria {

  @PrimaryGeneratedColumn()
  Id_Categoria: number;

  @Column({ unique: true, length: 50 })
  Nombre: string;

  @Column({ length: 200, nullable: true })
  Descripcion: string;
}