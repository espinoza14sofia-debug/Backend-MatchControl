import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionSistemaService } from './configuracion_sistema.service';
import { ConfiguracionSistemaController } from './configuracion_sistema.controller';
import { ConfiguracionSistema } from './entities/configuracion_sistema.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracionSistema])],
  controllers: [ConfiguracionSistemaController],
  providers: [ConfiguracionSistemaService],
  exports: [ConfiguracionSistemaService],
})
export class ConfiguracionSistemaModule { }