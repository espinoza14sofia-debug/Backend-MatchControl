import { Controller, Get, Post, Put, Body, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { DisciplinaService } from './disciplina.service';

@Controller('disciplina')
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

    @Put(':id')
    actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
        return this.disciplinaService.actualizar(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.disciplinaService.remove(id);
    }
}