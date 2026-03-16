import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';

// Módulo que integra la entidad, servicio y controlador de Notificaciones
@Module({
  imports: [TypeOrmModule.forFeature([Notificacion])],
  controllers: [NotificacionController],
  providers: [NotificacionService],
  exports: [NotificacionService], // Se exporta para poder usar el servicio en otros módulos si es necesario
})
export class NotificacionModule { }