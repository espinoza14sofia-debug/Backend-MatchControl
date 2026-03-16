
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudRol } from './entities/solicitud_rol.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class SolicitudService {

    constructor(
        @InjectRepository(SolicitudRol)
        private readonly solicitudRepo: Repository<SolicitudRol>,
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
    ) { }

    async crear(dto: any) {
        const nueva = this.solicitudRepo.create({
            ...dto,
            Estado: 'Pendiente'
        });
        return await this.solicitudRepo.save(nueva);
    }


    async obtenerPendientes() {
        return await this.solicitudRepo.find({
            where: { Estado: 'Pendiente' },
            relations: ['usuario']
        });
    }


    async procesar(idSolicitud: number, nuevoEstado: 'Aprobado' | 'Rechazado', idOrganizacion?: number) {
        const solicitud = await this.solicitudRepo.findOne({
            where: { Id_Solicitud: idSolicitud }
        });

        if (!solicitud) throw new NotFoundException('La solicitud no existe');


        solicitud.Estado = nuevoEstado;
        await this.solicitudRepo.save(solicitud);
        if (nuevoEstado === 'Aprobado') {
            const cambiosUsuario: any = {
                rol: { id: solicitud.Rol_Solicitado }
            };

            if (idOrganizacion) {
                cambiosUsuario.organizacion = { id: idOrganizacion };
            }

            await this.usuarioRepo.update(solicitud.Id_Usuario, cambiosUsuario);
        }

        return { message: `Solicitud ${nuevoEstado} con éxito` };
    }
}