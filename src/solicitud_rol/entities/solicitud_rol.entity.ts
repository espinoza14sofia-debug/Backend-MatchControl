// Importa los decoradores de TypeORM para definir entidades y relaciones
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// Importa la entidad Usuario para la relación
import { Usuario } from '../../usuario/entities/usuario.entity';

// Define la tabla Solicitud_Rol
@Entity('Solicitud_Rol')
export class SolicitudRol {
    
    // Columna ID autoincremental para la solicitud
    @PrimaryGeneratedColumn()
    Id_Solicitud: number; // identificador único de la solicitud

    // Columna que guarda el ID del usuario que solicita el rol
    @Column()
    Id_Usuario: number; // referencia al usuario

    // Columna que guarda el rol solicitado (como ID)
    @Column()
    Rol_Solicitado: number; // referencia al rol solicitado

    // Columna de texto para el motivo de la solicitud (máx 500 caracteres, puede ser nulo)
    @Column({ length: 500, nullable: true })
    Motivo: string; // motivo de la solicitud

    // Columna para el estado de la solicitud, por defecto "Pendiente"
    @Column({ default: 'Pendiente' })
    Estado: string; // estado de la solicitud

    // Columna de fecha de creación, por defecto la fecha actual
    @Column({ type: 'datetime', default: () => 'GETDATE()' })
    Fecha_Creacion: Date; // fecha en que se creó la solicitud

    // Relación ManyToOne con la entidad Usuario
    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'Id_Usuario' }) // une la columna Id_Usuario con la entidad Usuario
    usuario: Usuario; // relación con el usuario que hizo la solicitud
}