import { Controller, Post, Body, ConflictException } from '@nestjs/common';
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
        if (existeNick) {
            throw new ConflictException('El nickname ya está en uso');
        }


        const existeEmail = await this.usuariosService.buscarPorEmail(body.email);
        if (existeEmail) {
            throw new ConflictException('El correo ya está registrado');
        }


        const hash = await bcrypt.hash(body.passwordHash, 10);

        const nuevo = await this.usuariosService.crear({
            nombreCompleto: body.nombreCompleto,
            nickname: body.nickname,
            email: body.email,
            passwordHash: hash,
            idRol: 4,
        });

        return {
            mensaje: 'Usuario registrado correctamente',
            id: nuevo.id,
            nickname: nuevo.nickname,
        };
    }
}