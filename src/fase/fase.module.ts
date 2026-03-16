import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaseService } from './fase.service';
import { FaseController } from './fase.controller';
import { Fase } from './entities/fase.entity';

 
@Module({ 
  imports: [TypeOrmModule.forFeature([Fase])],
  controllers: [FaseController],
  providers: [FaseService],
  exports: [FaseService]
})
export class FaseModule {}