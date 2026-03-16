import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Usuario } from '../usuario/entities/usuario.entity';  
@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'matchcontrol_secret_2026',
            signOptions: { expiresIn: '8h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}