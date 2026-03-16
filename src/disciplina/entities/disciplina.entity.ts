import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('Disciplina')
export class Disciplina {


    @PrimaryGeneratedColumn()
    Id_Disciplina: number;


    @Column()
    Id_Categoria: number;

    @Column({ length: 50 })
    Nombre: string;

    @Column()
    Tipo_Participacion: string;


    @Column()
    Min_Integrantes: number;

    @Column({ nullable: true })
    Max_Integrantes: number;
}