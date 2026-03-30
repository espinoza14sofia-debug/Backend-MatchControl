import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { OrganizacionService } from './organizacion.service';

@Controller('organizacion')
export class OrganizacionController {

  constructor(private readonly organizacionService: OrganizacionService) { }

  @Post()
  create(@Body() dto: any) {
    return this.organizacionService.create(dto);
  }

  @Get()
  findAll() {
    return this.organizacionService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizacionService.remove(+id);
  }
}