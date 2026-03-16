// Importa los decoradores de TypeORM para definir entidades y columnas
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Define la tabla "Posiciones" en la base de datos
@Entity({ name: 'Posiciones' })
export class Posiciones {
  
  // Columna ID autoincremental con nombre "Id_Posicion"
  @PrimaryGeneratedColumn({ name: 'Id_Posicion' })
  Id_Posicion: number; // identificador único de la posición

  // Columna que guarda el ID de la fase
  @Column({ name: 'Id_Fase' })
  Id_Fase: number; // referencia a la fase

  // Columna que guarda el ID del grupo (puede ser nulo)
  @Column({ name: 'Id_Grupo', nullable: true })
  Id_Grupo: number; // referencia al grupo

  // Columna que guarda el ID del participante
  @Column({ name: 'Id_Participante' })
  Id_Participante: number; // referencia al participante

  // Columna de puntos, por defecto 0
  @Column({ name: 'Puntos', default: 0 })
  Puntos: number; // puntos acumulados

  // Columna de partidos jugados, por defecto 0
  @Column({ name: 'PJ', default: 0 })
  PJ: number; // partidos jugados

  // Columna de partidos ganados, por defecto 0
  @Column({ name: 'PG', default: 0 })
  PG: number; // partidos ganados

  // Columna de partidos empatados, por defecto 0
  @Column({ name: 'PE', default: 0 })
  PE: number; // partidos empatados

  // Columna de partidos perdidos, por defecto 0
  @Column({ name: 'PP', default: 0 })
  PP: number; // partidos perdidos

  // Columna de score a favor, por defecto 0
  @Column({ name: 'Score_Favor', default: 0 })
  Score_Favor: number; // puntos a favor

  // Columna de score en contra, por defecto 0
  @Column({ name: 'Score_Contra', default: 0 })
  Score_Contra: number; // puntos en contra
}