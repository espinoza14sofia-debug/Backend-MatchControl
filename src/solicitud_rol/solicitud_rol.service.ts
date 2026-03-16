// Importa el decorador Injectable y la excepción NotFound de NestJS
import { Injectable, NotFoundException } from '@nestjs/common';
// Importa la función para inyectar repositorios de TypeORM
import { InjectRepository } from '@nestjs/typeorm';
// Importa la clase Repository de TypeORM
import { Repository } from 'typeorm';
// Importa la entidad SolicitudRol
import { SolicitudRol } from './entities/solicitud_rol.entity';
// Importa la entidad Usuario
import { Usuario } from '../usuario/entities/usuario.entity';

// Define el servicio de SolicitudRol
@Injectable()
export class SolicitudService {
    
    // Constructor que inyecta los repositorios de SolicitudRol y Usuario
    constructor(
        @InjectRepository(SolicitudRol)
        private readonly solicitudRepo: Repository<SolicitudRol>,
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
    ) { }

    // Método para crear una nueva solicitud de rol
    async crear(dto: any) {
        const nueva = this.solicitudRepo.create({
            ...dto,
            Estado: 'Pendiente' // siempre inicia como pendiente
        });
        return await this.solicitudRepo.save(nueva); // guarda en la base de datos
    }

    // Método para obtener todas las solicitudes pendientes
    async obtenerPendientes() {
        return await this.solicitudRepo.find({
            where: { Estado: 'Pendiente' }, // filtra solo las pendientes
            relations: ['usuario'] // incluye la relación con el usuario
        });
    }

    // Método para procesar (aprobar o rechazar) una solicitud
    async procesar(idSolicitud: number, nuevoEstado: 'Aprobado' | 'Rechazado', idOrganizacion?: number) {
        const solicitud = await this.solicitudRepo.findOne({
            where: { Id_Solicitud: idSolicitud } // busca la solicitud por ID
        });

        if (!solicitud) throw new NotFoundException('La solicitud no existe'); // lanza error si no existe

        // Actualiza el estado de la solicitud
        solicitud.Estado = nuevoEstado;
        await this.solicitudRepo.save(solicitud);

        // Si la solicitud fue aprobada, actualiza el rol y opcionalmente la organización del usuario
        if (nuevoEstado === 'Aprobado') {
            const cambiosUsuario: any = {
                rol: { id: solicitud.Rol_Solicitado } // asigna el nuevo rol
            };

            if (idOrganizacion) {
                cambiosUsuario.organizacion = { id: idOrganizacion }; // asigna organización si se envió
            }

            await this.usuarioRepo.update(solicitud.Id_Usuario, cambiosUsuario); // actualiza el usuario
        }

        return { message: `Solicitud ${nuevoEstado} con éxito` }; // devuelve mensaje de confirmación
    }
}