import { Module } from '@nestjs/common';
import { SolicitudController } from './solicitud_rol.controller';
import { SolicitudService } from './solicitud_rol.service';

@Module({
    controllers: [SolicitudController],
    providers: [SolicitudService],
    exports: [SolicitudService]
})
export class SolicitudModule {}