import { Controller, Get, Param, Patch, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolesGuard } from '../auth/roles.guard';


@Controller('rol')
@UseGuards(RolesGuard)
export class RolController {

  constructor(private readonly rolService: RolService) { }

  @Get()
  @SetMetadata('roles', ['Admin'])
  findAll() {
    return this.rolService.findAll();
  }


  @Patch(':id')
  @SetMetadata('roles', ['Admin'])
  update(@Param('id') id: string, @Body() dto: any) {
    return this.rolService.update(+id, dto);
  }
}