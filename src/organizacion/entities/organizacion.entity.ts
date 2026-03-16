import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('Organizacion')
export class Organizacion {

  @PrimaryGeneratedColumn({ name: 'Id_Organizacion' })
  id: number;

  @Column({ name: 'Nombre', length: 100, unique: true })
  nombre: string;


  @Column({ name: 'Email', length: 100, nullable: true })
  email: string;


  @Column({ name: 'Telefono', length: 20, nullable: true })
  telefono: string;


  @Column({ name: 'Estado', default: true })
  estado: boolean;


  @CreateDateColumn({ name: 'Fecha_Creacion' })
  fechaCreacion: Date;
}