import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { DisciplinaService } from './disciplina.service';
import { RolesGuard } from '../auth/roles.guard';


@Controller('disciplina')

@UseGuards(RolesGuard)
export class DisciplinaController {

    constructor(private readonly disciplinaService: DisciplinaService) { }


    @Post()
    crear(@Body() dto: any) {
        return this.disciplinaService.crear(dto);
    }


    @Get()
    findAll() {
        return this.disciplinaService.findAll();
    }


    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.disciplinaService.remove(+id);
    }
}