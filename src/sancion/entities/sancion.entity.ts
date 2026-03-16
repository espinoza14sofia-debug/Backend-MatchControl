// Importa los decoradores de TypeORM para definir entidades y columnas
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Define la tabla Sancion en la base de datos
@Entity('Sancion')
export class Sancion {

    // Columna ID autoincremental para la sanción
    @PrimaryGeneratedColumn()
    Id_Sancion: number; // identificador único de la sanción

    // Columna que guarda el ID del torneo
    @Column()
    Id_Torneo: number; // referencia al torneo

    // Columna que guarda el ID del participante sancionado
    @Column()
    Id_Participante: number; // referencia al participante

    // Columna de texto para el tipo de sanción (máx 200 caracteres)
    @Column({ type: 'nvarchar', length: 200 })
    Tipo_Sancion: string; // tipo de sanción aplicada

    // Columna de texto para el motivo de la sanción (máx 1000 caracteres)
    @Column({ type: 'nvarchar', length: 1000 })
    Motivo: string; // motivo de la sanción

    // Columna de fecha y hora de la sanción, por defecto la fecha actual
    @Column({ type: 'datetime', default: () => 'GETDATE()' })
    Fecha_Sancion: Date; // fecha en que se aplicó la sanción
}