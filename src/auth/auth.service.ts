import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
        private readonly jwtService: JwtService,
    ) { }

    async login(nickname: string, password: string) {

        const usuario = await this.usuarioRepo.findOne({
            where: { nickname },
            relations: ['rol'],
        });

        if (!usuario) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        if (!usuario.estado) {
            throw new UnauthorizedException('Cuenta desactivada');
        }

        const passwordValido = await bcrypt.compare(
            password,
            usuario.passwordHash
        );

        if (!passwordValido) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const payload = {
            sub: usuario.id,
            nickname: usuario.nickname,
            rolId: usuario.rol.id,
            rolNombre: usuario.rol.nombre,
        };

        return {
            access_token: this.jwtService.sign(payload),
            usuario: {
                id: usuario.id,
                nickname: usuario.nickname,
                nombreCompleto: usuario.nombreCompleto,
                email: usuario.email,
                idOrganizacion: usuario.idOrganizacion ?? null,
                rol: {
                    id: usuario.rol.id,
                    nombre: usuario.rol.nombre,
                },
            },
        };
    }
}