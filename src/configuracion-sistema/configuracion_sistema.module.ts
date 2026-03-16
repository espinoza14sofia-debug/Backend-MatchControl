import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionSistemaService } from './configuracion_sistema.service';
import { ConfiguracionSistemaController } from './configuracion_sistema.controller';
import { ConfiguracionSistema } from './entities/configuracion_sistema.entity';

// Módulo que agrupa todo lo relacionado con la configuración del sistema
@Module({

  // Se importa la entidad para poder trabajar con la tabla en la base de datos
  imports: [TypeOrmModule.forFeature([ConfiguracionSistema])],

  // Controlador que maneja las rutas de configuración
  controllers: [ConfiguracionSistemaController],

  // Servicio donde está la lógica de las configuraciones
  providers: [ConfiguracionSistemaService],

  // Se exporta el servicio para que otros módulos puedan usarlo si lo necesitan
  exports: [ConfiguracionSistemaService],
})
export class ConfiguracionSistemaModule {}