import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Entidad que representa la tabla Match en la base de datos
@Entity('Match')
export class Match {

    // Identificador único del partido
    @PrimaryGeneratedColumn()
    Id_Match: number;

    // Fase a la que pertenece el partido
    @Column()
    Id_Fase: number;

    // Grupo al que pertenece el partido (puede ser null)
    @Column({ nullable: true })
    Id_Grupo: number;

    // Árbitro asignado al partido (puede ser null)
    @Column({ nullable: true })
    Id_Arbitro: number;

    // Fecha y hora programada del partido
    @Column({ type: 'datetime', nullable: true })
    Fecha_Hora: Date;

    // Lugar donde se jugará el partido
    @Column({ length: 400, nullable: true })
    Ubicacion: string;

    // Estado del partido (Pendiente, Finalizado, etc.)
    @Column({ length: 40, nullable: true })
    Estado: string;
}