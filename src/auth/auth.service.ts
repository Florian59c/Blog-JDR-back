import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole } from './interfaces/auth.interface';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  async login(loginDto: LoginDto, res: Response): Promise<string> {
    try {
      const { email, password } = loginDto;
      const findedUserByMail = await this.userService.findUserByMail({ email });
      if (!findedUserByMail || !(await bcrypt.compare(password, findedUserByMail.password))) {
        return "L'adresse mail ou le mot de passe est incorrect";
      }
      const payload = { sub: findedUserByMail.id, role: findedUserByMail.role }; // Inclut l'ID et le rôle
      const jwt = this.jwtService.sign(payload);
      res.cookie('auth-token', jwt, {
        httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client
        secure: process.env.NODE_ENV === 'production', // Active uniquement en HTTPS en production
        maxAge: 60 * 60 * 1000, // Durée de vie : 1 heure
        sameSite: 'strict', // Empêche l'envoi des cookies sur des requêtes cross-site
      });
      return 'ok';
    } catch (error) {
      console.error(error);
      return 'Une erreur est survenue lors de la connexion';
    }
  }

  async logout(res: Response): Promise<string> {
    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return 'Déconnexion réussie';
  }

  checkRole(token: string): UserRole {
    try {
      if (!token) {
        return { role: 'none' };
      } else {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
        return { role: decoded.role };
      }
    } catch (err) {
      throw new Error('Unauthorized');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { token, password } = resetPasswordDto;
    try {
      // Vérifier et décoder le token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      // Récupérer l'utilisateur en BDD
      const user = await this.userService.findUserById({ id: decoded.userId });
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
      // Hacher le nouveau mot de passe
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      await this.userService.updatePassword({ id: user.id, password: hashedPassword });
      return "ok";
    } catch (error) {
      console.error(error);
      return "Lien invalide ou expiré";
    }
  }
}