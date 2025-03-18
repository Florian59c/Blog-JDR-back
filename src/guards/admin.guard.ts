import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['auth-token']; // Récupérer le token dans le cookie 'auth-token'

        if (!token) {
            throw new ForbiddenException('Aucun token n\'est fourni');
        }

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.role !== 'admin') {
                throw new ForbiddenException('Accès non autorisé');
            }

            return true;
        } catch (error) {
            throw new ForbiddenException('Le token est invalide');
        }
    }
}
