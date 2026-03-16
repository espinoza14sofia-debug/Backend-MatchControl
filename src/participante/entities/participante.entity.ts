import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Participante')
export class Participante {

  // ID del participante
  @PrimaryGeneratedColumn({ name: 'Id_Participante' })
  Id_Participante: number;

  // Torneo al que pertenece
  @Column({ name: 'Id_Torneo' })
  Id_Torneo: number;

  // Usuario participante (puede ser null)
  @Column({ name: 'Id_Usuario', nullable: true })
  Id_Usuario: number;

  // Equipo participante (puede ser null)
  @Column({ name: 'Id_Equipo', nullable: true })
  Id_Equipo: number;

  // Nombre que aparece en el torneo
  @Column({ name: 'Nombre_En_Torneo', length: 100, nullable: true })
  Nombre_En_Torneo: string;

  // Estado de inscripción
  @Column({ name: 'Estado_Inscripcion', default: 'Pendiente' })
  Estado_Inscripcion: string;

  // Fecha de registro
  @Column({
    name: 'Fecha_Registro',
    type: 'datetime',
    default: () => 'GETDATE()'
  })
  Fecha_Registro: Date;
}