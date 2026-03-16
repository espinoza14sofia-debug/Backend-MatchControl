import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Esta entidad representa la tabla Auditoria en la base de datos.
// Se usa para guardar registros de las acciones que hacen los usuarios en el sistema.
@Entity('Auditoria')
export class Auditoria {

    // Id único de cada registro de auditoría
    @PrimaryGeneratedColumn({ type: 'bigint' })
    Id_Auditoria: number;

    // Fecha en la que se realizó la acción
    // Se guarda automáticamente con la fecha actual
    @Column({ type: 'datetime', default: () => 'GETDATE()' })
    Fecha: Date;

    // Id del usuario que realizó la acción
    @Column()
    Id_Usuario: number;

    // Tipo de acción realizada ( INSERT, UPDATE, DELETE)
    @Column({ type: 'nvarchar', length: 100 })
    Accion: string;

    // Nombre de la tabla donde ocurrió la acción
    @Column({ type: 'nvarchar', length: 100 })
    Tabla: string;

    // Guarda los valores antes del cambio (si aplica)
    @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
    Valores_Anteriores: string;

    // Guarda los valores nuevos después del cambio
    @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
    Valores_Nuevos: string;

    // Dirección IP desde donde se hizo la acción
    @Column({ type: 'nvarchar', length: 90, nullable: true })
    IP_Address: string;
}