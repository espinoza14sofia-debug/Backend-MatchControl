import { Controller, Get, Post, Put, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
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

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.organizacionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizacionService.remove(id);
  }
}