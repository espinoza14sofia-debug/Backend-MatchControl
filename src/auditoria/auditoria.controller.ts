import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';

@Controller('auditoria')
export class AuditoriaController {

    constructor(private readonly service: AuditoriaService) { }

    @Get()
    async findAll() {
        return await this.service.obtenerTodo();
    }

    @Get('usuario/:id')
    async findByUser(@Param('id', ParseIntPipe) id: number) {
        return await this.service.obtenerPorUsuario(id);
    }
}