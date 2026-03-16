import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../rol/entities/rol.entity';
import { UsuariosService } from './usuario.service';
import { UsuariosController } from './usuario.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, Rol]),
    ],
    providers:   [UsuariosService],
    controllers: [UsuariosController],
    exports:     [UsuariosService],   
})
export class UsuariosModule {}