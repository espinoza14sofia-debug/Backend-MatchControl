import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

// DTO — define exactamente qué campos espera el body del login
class LoginDto {
    nickname: string;
    password: string;
}

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    // POST /auth/login
    // Body: { "nickname": "MortisGod", "password": "hash_1" }
    @Post('login')
    @HttpCode(200)
    login(@Body() body: LoginDto) {
        return this.authService.login(body.nickname, body.password);
    }
}