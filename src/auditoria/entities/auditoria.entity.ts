import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('Auditoria')
export class Auditoria {


    @PrimaryGeneratedColumn({ type: 'bigint' })
    Id_Auditoria: number;



    @Column({ type: 'datetime', default: () => 'GETDATE()' })
    Fecha: Date;


    @Column()
    Id_Usuario: number;

    @Column({ type: 'nvarchar', length: 100 })
    Accion: string;

    @Column({ type: 'nvarchar', length: 100 })
    Tabla: string;


    @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
    Valores_Anteriores: string;

    @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
    Valores_Nuevos: string;


    @Column({ type: 'nvarchar', length: 90, nullable: true })
    IP_Address: string;
}