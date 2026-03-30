import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AuditoriaService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async obtenerTodo() {
        return await this.dataSource.query(
            'SELECT * FROM Auditoria ORDER BY Fecha DESC'
        );
    }

    async obtenerPorUsuario(idUsuario: number) {
        return await this.dataSource.query(
            'SELECT * FROM Auditoria WHERE Id_Usuario = @0 ORDER BY Fecha DESC',
            [idUsuario]
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
}