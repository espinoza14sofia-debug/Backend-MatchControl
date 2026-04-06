import { Controller, Post, Get, Put, Delete, Body, Param, ConflictException } from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import * as bcrypt from 'bcrypt';

class RegisterDto {
    nombreCompleto: string;
    nickname: string;
    email: string;
    passwordHash: string;
    idRol: number;
}

@Controller('usuarios')
export class UsuariosController {

    constructor(private readonly usuariosService: UsuariosService) { }


    @Post()
    async registrar(@Body() body: RegisterDto) {
        const existeNick = await this.usuariosService.buscarPorNickname(body.nickname);
        if (existeNick) throw new ConflictException('El nickname ya está en uso');

        const existeEmail = await this.usuariosService.buscarPorEmail(body.email);
        if (existeEmail) throw new ConflictException('El correo ya está registrado');

        const hash = await bcrypt.hash(body.passwordHash, 10);

        const nuevo = await this.usuariosService.crear({
            nombreCompleto: body.nombreCompleto,
            nickname: body.nickname,
            email: body.email,
            passwordHash: hash,
            idRol: body.idRol ?? 4,
        });

        return { mensaje: 'Usuario registrado correctamente', data: nuevo };
    }


    @Get()
    findAll() {
        return this.usuariosService.findAll();
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usuariosService.findOne(+id);
    }


    @Put(':id')
    actualizar(@Param('id') id: string, @Body() dto: any) {
        return this.usuariosService.actualizar(+id, dto);
    }

    @Delete(':id')
    eliminar(@Param('id') id: string) {
        return this.usuariosService.eliminar(+id);
    }
}