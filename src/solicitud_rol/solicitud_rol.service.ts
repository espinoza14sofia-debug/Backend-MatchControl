import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SolicitudService {

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async crear(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarSolicitudRol @IdUsuario=@0, @RolSolicitado=@1, @Motivo=@2',
            [
                dto.Id_Usuario,
                dto.Rol_Solicitado,
                dto.Motivo
            ]
        );
    }

    async obtenerPendientes() {
        return await this.dataSource.query(
            `SELECT s.*, u.Nombre_Completo, u.Email, r.Nombre_Rol 
             FROM Solicitud_Rol s
             JOIN Usuario u ON s.Id_Usuario = u.Id_Usuario
             JOIN Rol r ON s.Rol_Solicitado = r.Id_Rol
             WHERE s.Estado = 'Pendiente'`
        );
    }

    async procesar(idSolicitud: number, nuevoEstado: 'Aprobado' | 'Rechazado', idOrganizacion?: number) {
        try {
            await this.dataSource.query(
                'EXEC sp_ProcesarSolicitudRol @IdSolicitud=@0, @NuevoEstado=@1, @IdOrganizacion=@2',
                [
                    idSolicitud,
                    nuevoEstado,
                    idOrganizacion ?? null
                ]
            );

            return { message: `Solicitud ${nuevoEstado} con éxito` };
        } catch (error) {
            throw new NotFoundException(error.message || 'Error al procesar la solicitud');
        }
    }
}