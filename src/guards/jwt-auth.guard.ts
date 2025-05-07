import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const token = request.cookies?.['auth-token'];

        if (!token) {
            throw new UnauthorizedException('Token manquant. Veuillez vous connecter.');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Ajout des infos utilisateur à la requête pour usage ultérieur
            request['user'] = decoded;
            return true;
        } catch (error) {
            response.clearCookie('auth-token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Votre session a expiré. Veuillez vous reconnecter.');
            }
            throw new UnauthorizedException('Token invalide. Veuillez vous reconnecter.');
        }
    }
}