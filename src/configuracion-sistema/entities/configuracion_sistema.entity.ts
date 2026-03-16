import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Esta entidad representa la tabla Configuracion_Sistema en la base de datos
// Se usa para guardar configuraciones generales del sistema
@Entity('Configuracion_Sistema')
export class ConfiguracionSistema {

  // Id único de la configuración
  @PrimaryGeneratedColumn()
  Id_Config: number;

  // Clave o nombre de la configuración (debe ser única)
  @Column({ unique: true, length: 50 })
  Clave: string;

  // Valor de la configuración
  // Se usa NVARCHAR(MAX) para permitir textos largos
  @Column('nvarchar', { length: 'MAX' })
  Valor: string;

  // Descripción opcional para explicar para qué sirve la configuración
  @Column({ length: 255, nullable: true })
  Descripcion: string;
}