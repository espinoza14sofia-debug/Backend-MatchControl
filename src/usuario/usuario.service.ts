import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepo: Repository<Usuario>,
    ) {}

    // Busca por Nickname — usado por AuthService al hacer login
    async buscarPorNickname(nickname: string): Promise<Usuario | null> {
        return this.usuarioRepo.findOne({
            where: { nickname },
            relations: ['rol'],  // trae los datos de la tabla Rol
        });
    }

    // Busca por Email — usado para recuperar contraseña
    async buscarPorEmail(email: string): Promise<Usuario | null> {
        return this.usuarioRepo.findOne({
            where: { email },
            relations: ['rol'],
        });
    }

    // Busca por Id — usado para perfil
    async buscarPorId(id: number): Promise<Usuario | null> {
        return this.usuarioRepo.findOne({
            where: { id },
            relations: ['rol'],
        });
    }

    // Crea nuevo usuario — usado en registro
    async crear(datos: {
        nombreCompleto: string;
        nickname: string;
        email: string;
        passwordHash: string;
        idRol: number;
    }): Promise<Usuario> {
        const nuevo = this.usuarioRepo.create({
            nombreCompleto: datos.nombreCompleto,
            nickname:       datos.nickname,
            email:          datos.email,
            passwordHash:   datos.passwordHash,
            idRol:          datos.idRol,
            estado: true,
        });
        return this.usuarioRepo.save(nuevo);
    }
}