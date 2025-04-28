import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole } from './interfaces/auth.interface';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResponseMessage } from './interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  async login(loginDto: LoginDto, res: Response): Promise<ResponseMessage> {
    try {
      const { email, password } = loginDto;
      const findedUserByMail = await this.userService.findUserByMail({ email });

      if (!findedUserByMail || !(await bcrypt.compare(password, findedUserByMail.password))) {
        throw new UnauthorizedException("L'adresse mail ou le mot de passe est incorrect");
      }

      const payload = { sub: findedUserByMail.id, role: findedUserByMail.role }; // Inclut l'ID et le rôle
      const jwt = this.jwtService.sign(payload);

      res.cookie('auth-token', jwt, {
        httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client
        secure: process.env.NODE_ENV === 'production', // Active uniquement en HTTPS en production
        maxAge: 60 * 60 * 1000, // Durée de vie : 1 heure
        sameSite: 'strict', // Empêche l'envoi des cookies sur des requêtes cross-site
      });

      return { message: 'Connexion réussie' };
    } catch (error) {
      console.error(error);
      if (error instanceof UnauthorizedException) {
        throw error; // on relance, Nest gère le 401
      }
      throw new InternalServerErrorException('Une erreur est survenue lors de la connexion');
    }
  }

  async logout(res: Response): Promise<ResponseMessage> {
    try {
      res.clearCookie('auth-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return { message: 'Déconnexion réussie' };
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return { message: 'Erreur lors de la déconnexion', error: error.message };
    }
  }

  checkRole(token: string): UserRole {
    try {
      if (!token) {
        return { role: 'none' };  // Retourne 'none' si aucun token n'est fourni
      } else {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
        return { role: decoded.role || 'none' };  // Retourne le rôle décodé, ou 'none' si absent
      }
    } catch (err) {
      return { role: 'none' };  // Pour toutes les erreurs, retourne 'none'
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResponseMessage> {
    const { token, password } = resetPasswordDto;
    try {
      // Vérifier et décoder le token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur en BDD
      const user = await this.userService.findUserById({ id: decoded.userId });
      if (!user) {
        throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
      }

      // Hacher le nouveau mot de passe
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      await this.userService.updatePassword({ id: user.id, password: hashedPassword });

      return { message: 'Mot de passe réinitialisé avec succès' };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        // Token invalide ou expiré
        throw new HttpException('Lien invalide ou expiré', HttpStatus.UNAUTHORIZED);
      }
      console.error(error);
      throw new HttpException('Erreur interne du serveur', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}