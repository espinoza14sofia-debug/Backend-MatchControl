import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from '../../rol/entities/rol.entity';


@Entity('Usuario')  // nombre exacto de tu tabla SQL
export class Usuario {

  @PrimaryGeneratedColumn({ name: 'Id_Usuario' })
  id: number;

  @Column({ name: 'Id_Rol' })
  idRol: number;

@Column({ name: 'Id_Organizacion', type: 'int', nullable: true })
idOrganizacion: number;

  @Column({ name: 'Nombre_Completo' })
  nombreCompleto: string;

  @Column({ name: 'Nickname', unique: true })
  nickname: string;

  @Column({ name: 'Email', unique: true })
  email: string;

  @Column({ name: 'Password_Hash' })
  passwordHash: string;

@Column({ name: 'Estado', type: 'bit', default: 1 })
estado: boolean;

  @Column({ name: 'Fecha_Registro', type: 'datetime', default: () => 'GETDATE()' })
  fechaRegistro: Date;

  // Relación con tabla Rol
  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'Id_Rol' })
  rol: Rol;
}