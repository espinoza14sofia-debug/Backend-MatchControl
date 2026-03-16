import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Torneo')
export class Torneo {

    @PrimaryGeneratedColumn()
    Id_Torneo: number;


    @Column()
    Id_Disciplina: number;


    @Column()
    Id_Organizacion: number;


    @Column()
    Id_Creador: number;

    @Column()
    Nombre: string;


    @Column()
    Formato: string;

    @Column()
    Max_Participantes: number;


    @Column({ default: 'Borrador' })
    Estado: string;
}