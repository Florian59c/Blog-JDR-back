import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException('Token manquant. Veuillez vous connecter.');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Ajout des infos utilisateur à la requête pour usage ultérieur
            request['user'] = decoded;
            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Votre session a expiré. Veuillez vous reconnecter.');
            }
            throw new UnauthorizedException('Token invalide. Veuillez vous reconnecter.');
        }
    }
}