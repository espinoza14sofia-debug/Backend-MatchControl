import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuditoriaService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async findAll() {
        return await this.dataSource.query(
            'SELECT * FROM Auditoria ORDER BY Fecha_Evento DESC'
        );
    }

    async findByUsuario(idUsuario: number) {
        return await this.dataSource.query(
            'SELECT * FROM Auditoria WHERE Id_Usuario = @0 ORDER BY Fecha_Evento DESC',
            [idUsuario]
        );
    }

    async findByTabla(tabla: string) {
        return await this.dataSource.query(
            'SELECT * FROM Auditoria WHERE Tabla_Afectada = @0 ORDER BY Fecha_Evento DESC',
            [tabla]
        );
    }

    async crear(dto: any) {
        return await this.dataSource.query(
            'EXEC sp_InsertarAuditoria @IdUsuario=@0, @Accion=@1, @TablaAfectada=@2, @IdRegistroAfectado=@3, @Detalles=@4',
            [
                dto.Id_Usuario,
                dto.Accion,
                dto.Tabla_Afectada,
                dto.Id_Registro_Afectado,
                dto.Detalles
            ]
        );
    }

    async eliminar(id: number) {
        await this.dataSource.query(
            'DELETE FROM Auditoria WHERE Id_Auditoria = @0',
            [id]
        );
        return { success: true, message: `Registro de auditoría ${id} eliminado` };
    }
}