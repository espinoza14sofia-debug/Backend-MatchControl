import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class NotificacionService {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async obtenerTodas() {
        return await this.dataSource.query(
            'SELECT * FROM Notificacion ORDER BY Fecha_Envio DESC'
        );
    }

    async obtenerPorUsuario(idUsuario: number) {
        return await this.dataSource.query(
            'SELECT * FROM Notificacion WHERE Id_Usuario = @0 ORDER BY Fecha_Envio DESC',
            [idUsuario]
        );
    }

    async crear(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarNotificacion @IdUsuario=@0, @Titulo=@1, @Mensaje=@2, @Tipo=@3',
            [dto.Id_Usuario, dto.Titulo, dto.Mensaje, dto.Tipo]
        );
    }

    async marcarLeida(id: number) {
        await this.dataSource.query(
            'EXEC sp_MarcarNotificacionLeida @IdNotificacion=@0',
            [id]
        );
        return { mensaje: 'Notificación leída' };
    }

    async eliminar(id: number) {
        const resultado = await this.dataSource.query(
            'EXEC sp_EliminarNotificacion @IdNotificacion=@0',
            [id]
        );

        return { mensaje: `Notificación ${id} eliminada correctamente` };
    }
}