import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Entidad que representa la tabla Notificacion
@Entity('Notificacion')
export class Notificacion {

    // Identificador único de la notificación
    @PrimaryGeneratedColumn({ type: 'bigint' })
    Id_Notificacion: number;

    // Usuario que recibe la notificación
    @Column()
    Id_Usuario: number;

    // Título de la notificación
    @Column({ type: 'nvarchar', length: 200 })
    Titulo: string;

    // Contenido o mensaje de la notificación
    @Column({ type: 'nvarchar', length: 1000 })
    Mensaje: string;

    // Indica si la notificación fue leída
    @Column({ type: 'bit', default: 0 })
    Leido: boolean;

    // Fecha en que se envió la notificación
    @Column({ type: 'datetime', default: () => 'GETDATE()' })
    Fecha_Envio: Date;
}