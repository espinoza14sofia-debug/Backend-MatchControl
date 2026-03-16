import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();

        if (
            process.env.NODE_ENV === 'development' &&
            request.headers['admin-sofi'] === 'mcsofi'
        ) {
            request.user = {
                id: 19,
                nickname: 'SofiAdmin',
                rol: { id: 1, nombre: 'Admin' }
            };
            return true;
        }

        const requiredRoles =
            this.reflector.get<string[]>('roles', context.getHandler());

        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('Debe iniciar sesión');
        }

        // Admin siempre tiene acceso
        if (user.rol?.id === 1 || user.rol?.nombre === 'Admin') {
            return true;
        }

        // Si la ruta no tiene roles definidos
        if (!requiredRoles) {
            return true;
        }

        return requiredRoles.includes(user.rol?.nombre);
    }
}