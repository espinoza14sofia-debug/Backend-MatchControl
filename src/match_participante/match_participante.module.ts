import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchParticipanteService } from './match_participante.service';
import { MatchParticipanteController } from './match_participante.controller';
import { MatchParticipante } from './entities/match_participante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchParticipante])],
  controllers: [MatchParticipanteController],
  providers: [MatchParticipanteService],
  exports: [MatchParticipanteService]
})
export class MatchParticipanteModule { }