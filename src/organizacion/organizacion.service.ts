
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizacion } from './entities/organizacion.entity';


@Injectable()
export class OrganizacionService {


  constructor(
    @InjectRepository(Organizacion)
    private orgRepo: Repository<Organizacion>,
  ) { }


  async create(dto: any) {
    return await this.orgRepo.query(
      'EXEC sp_InsertarOrganizacion @Nombre=@0, @Email=@1, @Telefono=@2',
      [dto.nombre, dto.email, dto.telefono]
    );
  }

  async findAll() {
    return await this.orgRepo.find({ where: { estado: true } });
  }


  async findOne(id: number) {
    return await this.orgRepo.findOneBy({ id });
  }


  async remove(id: number) {
    return await this.orgRepo.query(
      'EXEC sp_EliminarOrganizacion @IdOrganizacion = @0',
      [id]
    );
  }
}