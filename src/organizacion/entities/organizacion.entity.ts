// Importa los decoradores de TypeORM para definir entidades y columnas
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// Define la tabla "Organizacion" en la base de datos
@Entity('Organizacion')
export class Organizacion {
  
  // Columna ID autoincremental con nombre "Id_Organizacion"
  @PrimaryGeneratedColumn({ name: 'Id_Organizacion' })
  id: number; // identificador único de la organización

  // Columna de texto para el nombre, máximo 100 caracteres, único
  @Column({ name: 'Nombre', length: 100, unique: true })
  nombre: string; // nombre de la organización

  // Columna de texto para email, máximo 100 caracteres, puede ser nulo
  @Column({ name: 'Email', length: 100, nullable: true })
  email: string; // correo electrónico de la organización

  // Columna de texto para teléfono, máximo 20 caracteres, puede ser nulo
  @Column({ name: 'Telefono', length: 20, nullable: true })
  telefono: string; // número de teléfono de la organización

  // Columna booleana, por defecto true
  @Column({ name: 'Estado', default: true })  
  estado: boolean; // indica si la organización está activa

  // Columna de fecha que se genera automáticamente al crear el registro
  @CreateDateColumn({ name: 'Fecha_Creacion' })
  fechaCreacion: Date; // guarda la fecha de creación
}