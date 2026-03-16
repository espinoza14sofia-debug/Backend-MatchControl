import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Configuracion_Sistema')
export class ConfiguracionSistema {

  @PrimaryGeneratedColumn()
  Id_Config: number;


  @Column({ unique: true, length: 50 })
  Clave: string;

  @Column('nvarchar', { length: 'MAX' })
  Valor: string;


  @Column({ length: 255, nullable: true })
  Descripcion: string;
}