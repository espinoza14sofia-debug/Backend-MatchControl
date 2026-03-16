import { Entity, Column, PrimaryColumn } from 'typeorm';

// Entidad que representa la tabla Match_Participante
@Entity('Match_Participante')
export class MatchParticipante {

    // Parte de la clave primaria compuesta: id del partido
    @PrimaryColumn()
    Id_Match: number;

    // Parte de la clave primaria compuesta: id del participante
    @PrimaryColumn()
    Id_Participante: number;

    // Indica el lado o posición del participante en el partido
    @Column({ type: 'int', nullable: true })
    Lado: number;

    // Indica si el participante fue el ganador
    @Column({ type: 'bit', nullable: true })
    Es_Ganador: boolean;

    // Puntaje final obtenido en el partido
    @Column({ type: 'int', nullable: true })
    Score_Final: number;
}