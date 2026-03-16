
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Sancion')
export class Sancion {


    @PrimaryGeneratedColumn()
    Id_Sancion: number;


    @Column()
    Id_Torneo: number;

    @Column()
    Id_Participante: number;


    @Column({ type: 'nvarchar', length: 200 })
    Tipo_Sancion: string;


    @Column({ type: 'nvarchar', length: 1000 })
    Motivo: string;


    @Column({ type: 'datetime', default: () => 'GETDATE()' })
    Fecha_Sancion: Date;
}