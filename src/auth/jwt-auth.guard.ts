import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Token no enviado');
        }

        const token = authHeader.replace('Bearer ', '');

        try {

            const payload = this.jwtService.verify(token);

            request.user = {
                id: payload.sub,
                nickname: payload.nickname,
                rol: {
                    id: payload.rolId,
                    nombre: payload.rolNombre
                }
            };

            return true;

        } catch {
            throw new UnauthorizedException('Token inválido');
        }
    }
}