
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sancion } from './entities/sancion.entity';
import { SancionService } from './sancion.service';
import { SancionController } from './sancion.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Sancion])],
  controllers: [SancionController],
  providers: [SancionService],
})
export class SancionModule { } 