import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { RolesGuard } from '../auth/roles.guard';

@Controller('categoria')
@UseGuards(RolesGuard)
export class CategoriaController {

  constructor(private readonly categoriaService: CategoriaService) { }

  @Post()
  crear(@Body() dto: any) {
    return this.categoriaService.crear(dto);
  }

  @Get()
  findAll() {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.findOne(id);
  }

  @Put(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.categoriaService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.eliminar(id);
  }
}