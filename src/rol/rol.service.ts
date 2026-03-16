
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';


@Injectable()
export class RolService {

  constructor(
    @InjectRepository(Rol)
    private rolRepo: Repository<Rol>,
  ) { }

  async findAll() {
    return await this.rolRepo.find();
  }

  async findByName(nombre: string) {
    return await this.rolRepo.findOneBy({ nombre });
  }

  async update(id: number, dto: any) {
    return await this.rolRepo.update(id, { descripcion: dto.descripcion }); // actualiza solo la descripción
  }
}