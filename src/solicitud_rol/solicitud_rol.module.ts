import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudController } from './solicitud_rol.controller';
import { SolicitudService } from './solicitud_rol.service';
import { SolicitudRol } from './entities/solicitud_rol.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([SolicitudRol, Usuario]),
        JwtModule.register({})
    ],
    controllers: [SolicitudController],
    providers: [SolicitudService],
    exports: [SolicitudService]
})
export class SolicitudRolModule { }