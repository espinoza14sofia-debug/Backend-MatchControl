import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('Notificacion')
export class Notificacion {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    Id_Notificacion: number;

    @Column()
    Id_Usuario: number;

    @Column({ type: 'nvarchar', length: 200 })
    Titulo: string;

    @Column({ type: 'nvarchar', length: 1000 })
    Mensaje: string;

    @Column({ type: 'bit', default: 0 })
    Leido: boolean;

    @Column({ type: 'datetime', default: () => 'GETDATE()' })
    Fecha_Envio: Date;
}