import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
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
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(+id);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {

    return this.categoriaService.eliminar(+id);
  }
}