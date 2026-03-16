import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchSetService } from './match_set.service';
import { MatchSetController } from './match_set.controller';

// Módulo que agrupa todo lo relacionado con los sets de los partidos
@Module({
  imports: [
    TypeOrmModule.forFeature([])
  ],
  providers: [MatchSetService],
  controllers: [MatchSetController]
})
export class MatchSetModule {}