import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Match')
export class Match {

    @PrimaryGeneratedColumn()
    Id_Match: number;

    @Column()
    Id_Fase: number;

    @Column({ nullable: true })
    Id_Grupo: number;

    @Column({ nullable: true })
    Id_Arbitro: number;

    @Column({ type: 'datetime', nullable: true })
    Fecha_Hora: Date;

    @Column({ length: 400, nullable: true })
    Ubicacion: string;


    @Column({ length: 40, nullable: true })
    Estado: string;
}