import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepo: Repository<Usuario>,
        private dataSource: DataSource,
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
            where: { id: id } as any,
            relations: ['rol'],
        });
    }

    async crear(datos: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarUsuario @IdRol=@0, @NombreCompleto=@1, @Nickname=@2, @Email=@3, @PasswordHash=@4',
            [datos.idRol, datos.nombreCompleto, datos.nickname, datos.email, datos.passwordHash]
        );
    }

    async actualizar(id: number, dto: any) {
        return await this.dataSource.query(
            'EXEC sp_ActualizarUsuario @IdUsuario=@0, @NombreCompleto=@1, @Email=@2',
            [id, dto.Nombre_Completo, dto.Email]
        );
    }

    async eliminar(id: number) {
        return await this.dataSource.query(
            'EXEC sp_EliminarUsuario @IdUsuario=@0',
            [id]
        );
    }
}