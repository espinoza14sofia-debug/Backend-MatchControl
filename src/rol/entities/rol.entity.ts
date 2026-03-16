import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Rol')
export class Rol {

    @PrimaryGeneratedColumn({ name: 'Id_Rol' })
    id: number;

    @Column({ name: 'Nombre' })
    nombre: string;

    @Column({ name: 'Descripcion', nullable: true })
    descripcion: string;
}