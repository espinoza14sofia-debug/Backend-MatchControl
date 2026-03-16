import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('Grupo')
export class Grupo {

  @PrimaryGeneratedColumn()
  Id_Grupo: number;

  @Column()
  Id_Fase: number;

  @Column()
  Nombre: string;
}