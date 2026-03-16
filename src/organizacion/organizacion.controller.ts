import { Controller, Get, Post, Body, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { OrganizacionService } from './organizacion.service';
import { RolesGuard } from '../auth/roles.guard';

@Controller('organizacion')
@UseGuards(RolesGuard)
export class OrganizacionController {


  constructor(private readonly organizacionService: OrganizacionService) { }

  @Post()
  @SetMetadata('roles', ['Admin'])
  create(@Body() dto: any) {
    return this.organizacionService.create(dto);
  }


  @Get()
  @SetMetadata('roles', ['Admin', 'Organizador'])
  findAll() {
    return this.organizacionService.findAll();
  }


  @Delete(':id')
  @SetMetadata('roles', ['Admin'])
  remove(@Param('id') id: string) {
    return this.organizacionService.remove(+id);
  }
}