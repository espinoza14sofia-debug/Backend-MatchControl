import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { RolesGuard } from '../auth/roles.guard';


@Controller('grupos')


@UseGuards(RolesGuard)
export class GrupoController {

  constructor(private readonly grupoService: GrupoService) { }

  @Post()
  crear(@Body() dto: any) {
    return this.grupoService.crear(dto);
  }

  @Get()
  findAll() {
    return this.grupoService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupoService.findOne(+id);
  }


  @Get('fase/:id')
  findByFase(@Param('id') id: string) {
    return this.grupoService.findByFase(+id);
  }


  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: any) {
    return this.grupoService.actualizar(+id, dto);
  }


  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.grupoService.eliminar(+id);
  }
}