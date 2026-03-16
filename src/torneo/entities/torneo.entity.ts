// Importa los decoradores de TypeORM para definir entidades y columnas
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Define la tabla "Torneo" en la base de datos
@Entity('Torneo')
export class Torneo {
    
    // Columna ID autoincremental para el torneo
    @PrimaryGeneratedColumn()
    Id_Torneo: number; // identificador único del torneo

    // Columna que guarda el ID de la disciplina
    @Column()
    Id_Disciplina: number; // referencia a la disciplina del torneo

    // Columna que guarda el ID de la organización
    @Column()
    Id_Organizacion: number; // referencia a la organización que gestiona el torneo

    // Columna que guarda el ID del creador del torneo
    @Column()
    Id_Creador: number; // referencia al usuario creador

    // Columna de texto para el nombre del torneo
    @Column()
    Nombre: string; // nombre del torneo

    // Columna de texto para el formato del torneo (ejemplo: liga, eliminación)
    @Column()
    Formato: string; // formato del torneo

    // Columna para el número máximo de participantes
    @Column()
    Max_Participantes: number; // límite de participantes

    // Columna para el estado del torneo, por defecto "Borrador"
    @Column({ default: 'Borrador' })
    Estado: string; // estado actual del torneo
}