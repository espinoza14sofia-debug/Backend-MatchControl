import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

// 1. Agregamos las propiedades a la clase
class LoginDto {
    nickname: string;
    password: string;
}

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto) {
        // Ahora TypeScript ya no marcará error aquí
        return this.authService.login(body.nickname, body.password);
    }
}