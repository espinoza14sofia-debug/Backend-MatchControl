import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Esta entidad representa la tabla Grupo en la base de datos
// Un grupo pertenece a una fase dentro de un torneo
@Entity('Grupo')
export class Grupo {

  // Id único del grupo
  @PrimaryGeneratedColumn()
  Id_Grupo: number;

  // Id de la fase a la que pertenece el grupo
  @Column()
  Id_Fase: number;

  // Nombre del grupo  
  @Column()
  Nombre: string;
}