// Importa el decorador Injectable de NestJS
import { Injectable } from '@nestjs/common';
// Importa la función para inyectar repositorios de TypeORM
import { InjectRepository } from '@nestjs/typeorm';
// Importa la clase Repository de TypeORM
import { Repository } from 'typeorm';
// Importa la entidad Posiciones
import { Posiciones } from './entities/posiciones.entity';

// Define el servicio de Posiciones
@Injectable()
export class PosicionesService {
    
    // Constructor que inyecta el repositorio de la entidad Posiciones
    constructor(
        @InjectRepository(Posiciones)
        private readonly repo: Repository<Posiciones>,
    ) { }

    // Método para obtener todas las posiciones
    async verTodas() {
        return await this.repo.find(); // devuelve todas las filas de la tabla
    }

    // Método para obtener posiciones de un torneo específico usando un SP
    async obtenerPosicionesPorTorneo(idTorneo: number) {
        return await this.repo.query(
            'EXEC sp_ObtenerTablaPosiciones @Id_Torneo = @0',
            [idTorneo]
        );
    }

    // Método para crear una nueva posición
    async crear(data: any) {
        const nueva = this.repo.create(data); // crea el objeto con los datos
        return await this.repo.save(nueva);   // guarda en la base de datos
    }

    // Método para actualizar una posición por ID
    async actualizar(id: number, data: any) {
        await this.repo.update(id, data); // actualiza la fila con el ID
        return await this.repo.findOne({ where: { Id_Posicion: id } }); // devuelve la posición actualizada
    }

    // Método para eliminar una posición por ID
    async eliminar(id: number) {
        return await this.repo.delete(id); // elimina la fila con el ID
    }
}