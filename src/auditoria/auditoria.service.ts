import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria } from './entities/auditoria.entity';


export class AuditoriaService {
    constructor(
        @InjectRepository(Auditoria)
        private readonly repo: Repository<Auditoria>,
    ) { }

    async obtenerTodo() {
        return await this.repo.find({
            order: { Fecha: 'DESC' }
        });
    }

    async obtenerPorUsuario(idUsuario: number) {
        return await this.repo.find({
            where: { Id_Usuario: idUsuario },
            order: { Fecha: 'DESC' }
        });
    }
}