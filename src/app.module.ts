import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RolModule } from './rol/rol.module';
import { OrganizacionModule } from './organizacion/organizacion.module';
import { UsuariosModule } from './usuario/usuario.module';
import { CategoriaModule } from './categoria/categoria.module';
import { DisciplinaModule } from './disciplina/disciplina.module';
import { ConfiguracionSistemaModule } from './configuracion-sistema/configuracion_sistema.module';
import { TorneoModule } from './torneo/torneo.module';
import { FaseModule } from './fase/fase.module';
import { GrupoModule } from './grupo/grupo.module';
import { EquipoModule } from './equipo/equipo.module';
import { EquipoJugadorModule } from './equipo_jugador/equipo_jugador.module';
import { ParticipanteModule } from './participante/participante.module';
import { MatchModule } from './match/match.module';
import { MatchParticipanteModule } from './match_participante/match_participante.module';
import { MatchSetModule } from './match_set/match_set.module';
import { PosicionesModule } from './posiciones/posiciones.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { SancionModule } from './sancion/sancion.module';
import { NotificacionModule } from './notificacion/notificacion.module';
import { SolicitudRolModule } from './solicitud_rol/solicitud_rol.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sofi_admin',
      password: '1234',
      database: 'MatchControl',
      autoLoadEntities: true,
      synchronize: false,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }),

    AuthModule,            

    RolModule,
    OrganizacionModule,
    UsuariosModule,
    CategoriaModule,
    DisciplinaModule,
    ConfiguracionSistemaModule,

    TorneoModule,
    FaseModule,
    GrupoModule,

    EquipoModule,
    EquipoJugadorModule,
    ParticipanteModule,

    MatchModule,
    MatchParticipanteModule,
    MatchSetModule,

    PosicionesModule,
    AuditoriaModule,
    SancionModule,
    NotificacionModule,
    SolicitudRolModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }