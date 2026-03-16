import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Match_Participante')
export class MatchParticipante {
    @PrimaryColumn()
    Id_Match: number;

    @PrimaryColumn()
    Id_Participante: number;

    @Column({ type: 'int', nullable: true })
    Lado: number;

    @Column({ type: 'bit', nullable: true })
    Es_Ganador: boolean;

    @Column({ type: 'int', nullable: true })
    Score_Final: number;
}