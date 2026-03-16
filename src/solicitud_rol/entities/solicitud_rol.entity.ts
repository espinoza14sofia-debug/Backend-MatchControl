
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';


@Entity('Solicitud_Rol')
export class SolicitudRol {

    @PrimaryGeneratedColumn()
    Id_Solicitud: number;


    @Column()
    Id_Usuario: number;

    @Column()
    Rol_Solicitado: number;


    @Column({ length: 500, nullable: true })
    Motivo: string;


    @Column({ default: 'Pendiente' })
    Estado: string;


    @Column({ type: 'datetime', default: () => 'GETDATE()' })
    Fecha_Creacion: Date;


    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'Id_Usuario' })
    usuario: Usuario;
}