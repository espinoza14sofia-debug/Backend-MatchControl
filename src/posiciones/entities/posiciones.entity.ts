
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Posiciones' })
export class Posiciones {

  @PrimaryGeneratedColumn({ name: 'Id_Posicion' })
  Id_Posicion: number;


  @Column({ name: 'Id_Fase' })
  Id_Fase: number;

  @Column({ name: 'Id_Grupo', nullable: true })
  Id_Grupo: number;

  @Column({ name: 'Id_Participante' })
  Id_Participante: number;

  @Column({ name: 'Puntos', default: 0 })
  Puntos: number;


  @Column({ name: 'PJ', default: 0 })
  PJ: number;

  @Column({ name: 'PG', default: 0 })
  PG: number;


  @Column({ name: 'PE', default: 0 })
  PE: number;


  @Column({ name: 'PP', default: 0 })
  PP: number;

  @Column({ name: 'Score_Favor', default: 0 })
  Score_Favor: number;


  @Column({ name: 'Score_Contra', default: 0 })
  Score_Contra: number;
}