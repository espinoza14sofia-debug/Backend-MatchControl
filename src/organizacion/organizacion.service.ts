import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Organizacion } from './entities/organizacion.entity';

@Injectable()
export class OrganizacionService {

  constructor(
    @InjectRepository(Organizacion)
    private readonly orgRepo: Repository<Organizacion>,
    private readonly dataSource: DataSource,
  ) { }

  async create(dto: any) {
    return await this.dataSource.query(
      'EXEC sp_InsertarOrganizacion @Nombre=@0, @Email=@1, @Telefono=@2',
      [dto.nombre, dto.email, dto.telefono]
    );
  }

  async findAll() {
    return await this.orgRepo.find({ where: { estado: true } });
  }

  async findOne(id: number) {
    const org = await this.orgRepo.findOneBy({ id_organizacion: id } as any);
    if (!org) throw new NotFoundException(`Organización con ID ${id} no encontrada`);
    return org;
  }

  async update(id: number, dto: any) {
    return await this.dataSource.query(
      'EXEC sp_ActualizarOrganizacion @IdOrganizacion=@0, @Nombre=@1, @Email=@2, @Telefono=@3',
      [id, dto.nombre, dto.email, dto.telefono]
    );
  }

  async remove(id: number) {
    return await this.dataSource.query(
      'EXEC sp_EliminarOrganizacion @IdOrganizacion = @0',
      [id]
    );
  }
}