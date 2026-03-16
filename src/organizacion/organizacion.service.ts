// Importa el decorador Injectable de NestJS
import { Injectable } from '@nestjs/common';
// Importa la función para inyectar repositorios de TypeORM
import { InjectRepository } from '@nestjs/typeorm';
// Importa la clase Repository de TypeORM
import { Repository } from 'typeorm';
// Importa la entidad Organizacion
import { Organizacion } from './entities/organizacion.entity';

// Define el servicio de Organización
@Injectable()
export class OrganizacionService {
  
  // Constructor que inyecta el repositorio de la entidad Organizacion
  constructor(
    @InjectRepository(Organizacion)
    private orgRepo: Repository<Organizacion>,
  ) { }

  // Método para crear una organización usando un procedimiento almacenado
  async create(dto: any) {
    return await this.orgRepo.query(
      'EXEC sp_InsertarOrganizacion @Nombre=@0, @Email=@1, @Telefono=@2',
      [dto.nombre, dto.email, dto.telefono]
    );
  }

  // Método para obtener todas las organizaciones activas
  async findAll() {
    return await this.orgRepo.find({ where: { estado: true } });
  }

  // Método para obtener una organización por su ID
  async findOne(id: number) {
    return await this.orgRepo.findOneBy({ id });
  }

  // Método para eliminar una organización usando un procedimiento almacenado
  async remove(id: number) {
    return await this.orgRepo.query(
      'EXEC sp_EliminarOrganizacion @IdOrganizacion = @0',
      [id]
    );
  }
}