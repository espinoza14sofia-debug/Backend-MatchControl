import { Controller, Get, Post, Body, Patch, Param, UseGuards, SetMetadata } from '@nestjs/common';
import { ConfiguracionSistemaService } from './configuracion_sistema.service';
import { RolesGuard } from '../auth/roles.guard';


@Controller('configuracion_sistema')


@UseGuards(RolesGuard)
export class ConfiguracionSistemaController {


  constructor(private readonly configService: ConfiguracionSistemaService) { }

  @Get()
  @SetMetadata('roles', ['Admin'])
  findAll() {
    return this.configService.findAll();
  }


  @Get(':id')
  @SetMetadata('roles', ['Admin'])
  findOne(@Param('id') id: string) {
    return this.configService.findOne(+id);
  }


  @Post()
  @SetMetadata('roles', ['Admin'])
  create(@Body() dto: any) {

    return this.configService.create(dto);
  }


  @Patch(':id')
  @SetMetadata('roles', ['Admin'])
  update(@Param('id') id: string, @Body() dto: any) {
    return this.configService.update(+id, dto);
  }
}