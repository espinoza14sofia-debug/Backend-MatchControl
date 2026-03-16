import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria } from './entities/auditoria.entity';

// Servicio que contiene la lógica para manejar los registros de auditoría
@Injectable()
export class AuditoriaService {

    // Se inyecta el repositorio de la entidad Auditoria para poder consultar la base de datos
    constructor(
        @InjectRepository(Auditoria)
        private readonly repo: Repository<Auditoria>,
    ) { }

    // Método para obtener todos los registros de auditoría
    // Se ordenan por fecha de forma descendente (los más recientes primero)
    async obtenerTodo() {
        return await this.repo.find({
            order: { Fecha: 'DESC' }
        });
    }

    // Método para obtener las auditorías hechas por un usuario específico
    async obtenerPorUsuario(idUsuario: number) {
        return await this.repo.find({
            where: { Id_Usuario: idUsuario },
            order: { Fecha: 'DESC' }
        });
    }
}