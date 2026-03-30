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
        try {
            return await this.dataSource.query(
                'EXEC sp_InsertarSolicitudRol @IdUsuario=@0, @RolSolicitado=@1, @Motivo=@2',
                [dto.Id_Usuario, dto.Rol_Solicitado, dto.Motivo]
            );
        } catch (error) {
            console.error('Error al crear solicitud:', error);
            throw new Error('Error al insertar la solicitud');
        }
    }

    async obtenerPendientes() {
        try {

            return await this.dataSource.query(
                `SELECT s.*, u.Nombre_Completo, u.Email, r.Nombre as Nombre_Rol 
                 FROM Solicitud_Rol s
                 JOIN Usuario u ON s.Id_Usuario = u.Id_Usuario
                 JOIN Rol r ON s.Rol_Solicitado = r.Id_Rol
                 WHERE s.Estado = 'Pendiente'`
            );
        } catch (error) {
            console.error('Error en obtenerPendientes (usando fallback):', error.message);

            return await this.dataSource.query("SELECT * FROM Solicitud_Rol WHERE Estado = 'Pendiente'");
        }
    }

    async procesar(idSolicitud: number, nuevoEstado: 'Aprobado' | 'Rechazado', idOrganizacion?: number) {
        try {
            await this.dataSource.query(
                'EXEC sp_ProcesarSolicitudRol @IdSolicitud=@0, @Estado=@1, @IdOrganizacion=@2',
                [
                    idSolicitud,
                    nuevoEstado,
                    idOrganizacion ?? null
                ]
            );
            return { message: `Solicitud ${nuevoEstado} con éxito` };
        } catch (error) {
            console.error('Error en procesar solicitud:', error.message);
            throw new NotFoundException(error.message || 'Error al procesar la solicitud');
        }
    }
}