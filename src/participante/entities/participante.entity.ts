import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Participante')
export class Participante {


  @PrimaryGeneratedColumn({ name: 'Id_Participante' })
  Id_Participante: number;


  @Column({ name: 'Id_Torneo' })
  Id_Torneo: number;


  @Column({ name: 'Id_Usuario', nullable: true })
  Id_Usuario: number;


  @Column({ name: 'Id_Equipo', nullable: true })
  Id_Equipo: number;


  @Column({ name: 'Nombre_En_Torneo', length: 100, nullable: true })
  Nombre_En_Torneo: string;


  @Column({ name: 'Estado_Inscripcion', default: 'Pendiente' })
  Estado_Inscripcion: string;


  @Column({
    name: 'Fecha_Registro',
    type: 'datetime',
    default: () => 'GETDATE()'
  })
  Fecha_Registro: Date;
}