import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizacion } from './entities/organizacion.entity';  
import { OrganizacionService } from './organizacion.service';
import { OrganizacionController } from './organizacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organizacion])],
  controllers: [OrganizacionController],
  providers: [OrganizacionService],
  exports: [OrganizacionService],
})
export class OrganizacionModule {} 