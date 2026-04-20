import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SolicitudService {

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async crear(dto: any) {
        try {
            return await this.dataSource.query(
                'EXEC sp_InsertarSolicitudRol @IdUsuario=@0, @RolSolicitado=@1, @Motivo=@2',
                [dto.id_usuario, dto.rol_solicitado, dto.motivo || '']
            );
        } catch (error: any) {
            throw new BadRequestException('Error al insertar la solicitud');
        }
    }

    async obtenerPorUsuario(idUsuario: number) {
        try {
            return await this.dataSource.query(
                `SELECT s.*, r.Nombre as Nombre_Rol, u.Nombre_Completo 
                 FROM Solicitud_Rol s
                 JOIN Rol r ON s.Rol_Solicitado = r.Id_Rol
                 JOIN Usuario u ON s.Id_Usuario = u.Id_Usuario
                 WHERE s.Id_Usuario = @0 
                 ORDER BY s.Fecha_Creacion DESC`,
                [idUsuario]
            );
        } catch (error: any) {
            return [];
        }
    }

    async obtenerPendientes() {
        try {
            return await this.dataSource.query(
                `SELECT 
                    s.Id_Solicitud,
                    s.Id_Usuario,
                    u.Nombre_Completo,
                    u.Nombre_Completo as Nombre_Usuario,
                    s.Motivo,
                    s.Estado,
                    s.Fecha_Creacion,
                    r.Nombre as Nombre_Rol 
                 FROM Solicitud_Rol s
                 INNER JOIN Usuario u ON s.Id_Usuario = u.Id_Usuario
                 INNER JOIN Rol r ON s.Rol_Solicitado = r.Id_Rol
                 WHERE s.Estado = 'Pendiente'`
            );
        } catch (error: any) {
            return [];
        }
    }

    async procesar(idSolicitud: number, nuevoEstado: 'Aprobado' | 'Rechazado', idOrganizacion?: number) {
        try {
            await this.dataSource.query(
                'EXEC sp_ProcesarSolicitudRol @IdSolicitud=@0, @Estado=@1, @IdOrganizacion=@2',
                [idSolicitud, nuevoEstado, idOrganizacion ?? null]
            );
            return { message: `Solicitud ${nuevoEstado} con éxito` };
        } catch (error: any) {
            throw new NotFoundException(error.message);
        }
    }
}