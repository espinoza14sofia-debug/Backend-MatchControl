import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepo: Repository<Usuario>,
    ) { }

    async buscarPorNickname(nickname: string): Promise<Usuario | null> {
        return this.usuarioRepo.findOne({
            where: { nickname },
            relations: ['rol'],
        });
    }


    async buscarPorEmail(email: string): Promise<Usuario | null> {
        return this.usuarioRepo.findOne({
            where: { email },
            relations: ['rol'],
        });
    }


    async buscarPorId(id: number): Promise<Usuario | null> {
        return this.usuarioRepo.findOne({
            where: { id },
            relations: ['rol'],
        });
    }


    async crear(datos: {
        nombreCompleto: string;
        nickname: string;
        email: string;
        passwordHash: string;
        idRol: number;
    }): Promise<Usuario> {
        const nuevo = this.usuarioRepo.create({
            nombreCompleto: datos.nombreCompleto,
            nickname: datos.nickname,
            email: datos.email,
            passwordHash: datos.passwordHash,
            idRol: datos.idRol,
            estado: true,
        });
        return this.usuarioRepo.save(nuevo);
    }
}