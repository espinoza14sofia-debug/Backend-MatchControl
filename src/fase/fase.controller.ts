import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { FaseService } from './fase.service';
import { RolesGuard } from '../auth/roles.guard';

@Controller('fases')


@UseGuards(RolesGuard)
export class FaseController {

  constructor(private readonly faseService: FaseService) { }

  @Post()
  crear(@Body() dto: any) {
    return this.faseService.crear(dto);
  }


  @Get()
  findAll() {
    return this.faseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faseService.findOne(+id);
  }


  @Get('torneo/:id')
  findByTorneo(@Param('id') id: string) {
    return this.faseService.findByTorneo(+id);
  }


  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: any) {
    return this.faseService.actualizar(+id, dto);
  }


  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.faseService.eliminar(+id);
  }
}