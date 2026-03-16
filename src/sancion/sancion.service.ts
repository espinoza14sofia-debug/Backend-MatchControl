// Importa el decorador Injectable y la excepción NotFound de NestJS
import { Injectable, NotFoundException } from '@nestjs/common';
// Importa la función para inyectar repositorios de TypeORM
import { InjectRepository } from '@nestjs/typeorm';
// Importa la clase Repository de TypeORM
import { Repository } from 'typeorm';
// Importa la entidad Sancion
import { Sancion } from './entities/sancion.entity';

// Define el servicio de Sanción
@Injectable()
export class SancionService {
    
    // Constructor que inyecta el repositorio de la entidad Sancion
    constructor(
        @InjectRepository(Sancion)
        private readonly repo: Repository<Sancion>,
    ) { }

    // Método para obtener todas las sanciones
    async obtenerTodas() {
        return await this.repo.find(); // devuelve todas las filas de la tabla Sancion
    }

    // Método para obtener sanciones de un torneo específico
    async obtenerPorTorneo(idTorneo: number) {
        return await this.repo.find({ where: { Id_Torneo: idTorneo } }); // busca por Id_Torneo
    }

    // Método para crear una nueva sanción
    async crear(data: any) {
        const nuevaSancion = this.repo.create(data); // crea el objeto con los datos
        return await this.repo.save(nuevaSancion);   // guarda en la base de datos
    }

    // Método para actualizar una sanción por ID
    async actualizar(id: number, data: any) {
        await this.repo.update(id, data); // actualiza la fila con el ID
        const actualizado = await this.repo.findOneBy({ Id_Sancion: id }); // busca la sanción actualizada
        if (!actualizado) throw new NotFoundException('Sanción no encontrada'); // lanza error si no existe
        return actualizado; // devuelve la sanción actualizada
    }

    // Método para eliminar una sanción por ID
    async eliminar(id: number) {
        return await this.repo.delete(id); // elimina la fila con el ID
    }
}