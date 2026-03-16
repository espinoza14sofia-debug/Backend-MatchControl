import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('Fase')
export class Fase {


  @PrimaryGeneratedColumn()
  Id_Fase: number;

  @Column()
  Id_Torneo: number;


  @Column()
  Nombre: string;

  @Column()
  Orden: number;

}