import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Esta entidad representa la tabla Fase en la base de datos
@Entity('Fase')
export class Fase {

  // Id único de la fase
  @PrimaryGeneratedColumn()
  Id_Fase: number;

  // Id del torneo al que pertenece la fase
  @Column()
  Id_Torneo: number;

  // Nombre de la fase
  @Column()
  Nombre: string;

  // Orden en el que se juega la fase dentro del torneo
  @Column()
  Orden: number;

}