// Importa el decorador Injectable de NestJS
import { Injectable } from '@nestjs/common';
// Importa la función para inyectar repositorios de TypeORM
import { InjectRepository } from '@nestjs/typeorm';
// Importa la clase Repository de TypeORM
import { Repository } from 'typeorm';
// Importa la entidad Rol
import { Rol } from './entities/rol.entity';

// Define el servicio de Rol
@Injectable()
export class RolService {
  
  // Constructor que inyecta el repositorio de la entidad Rol
  constructor(
    @InjectRepository(Rol)
    private rolRepo: Repository<Rol>,
  ) { }

  // Método para obtener todos los roles
  async findAll() {
    return await this.rolRepo.find(); // devuelve todos los registros de la tabla Rol
  }

  // Método para buscar un rol por su nombre
  async findByName(nombre: string) {
    return await this.rolRepo.findOneBy({ nombre }); // busca un rol con el nombre indicado
  }

  // Método para actualizar la descripción de un rol por ID
  async update(id: number, dto: any) {
    return await this.rolRepo.update(id, { descripcion: dto.descripcion }); // actualiza solo la descripción
  }
}