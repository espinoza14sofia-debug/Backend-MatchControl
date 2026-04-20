import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'matchcontrol_secret_2026',
        });
    }

    async validate(payload: any) {
        return {
            id: payload.sub,       
            Id_Usuario: payload.sub,  
            nickname: payload.nickname,
            rol: payload.rol,        
        };
    }
}
