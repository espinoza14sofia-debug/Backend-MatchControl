import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Esta entidad representa la tabla Disciplina en la base de datos
@Entity('Disciplina')
export class Disciplina {

    // Id único de la disciplina
    @PrimaryGeneratedColumn()
    Id_Disciplina: number;

    // Id de la categoría a la que pertenece la disciplina
    @Column()
    Id_Categoria: number;

    // Nombre de la disciplina (por ejemplo: Fútbol, Tenis, etc.)
    @Column({ length: 50 })
    Nombre: string;

    // Tipo de participación (individual o en equipo)
    @Column()
    Tipo_Participacion: string;

    // Cantidad mínima de integrantes requeridos
    @Column()
    Min_Integrantes: number;

    // Cantidad máxima de integrantes permitidos (puede ser nulo)
    @Column({ nullable: true })
    Max_Integrantes: number;
}