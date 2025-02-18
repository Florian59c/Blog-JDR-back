import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole } from './interfaces/auth.interface';

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
      if (findedUserByMail) {
        const isPasswordValid = await bcrypt.compare(password, findedUserByMail.password)
        if (isPasswordValid) {
          const payload = { sub: findedUserByMail.id, role: findedUserByMail.role }; // Inclut l'ID et le rôle
          const jwt = this.jwtService.sign(payload);
          res.cookie('auth-token', jwt, {
            httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client
            // secure: process.env.NODE_ENV === 'production', // Active uniquement en HTTPS en production
            maxAge: 60 * 60 * 1000, // Durée de vie : 1 heure
            sameSite: 'strict', // Empêche l'envoi des cookies sur des requêtes cross-site
          });
          return 'ok';
        } else {
          return 'Le mot de passe est incorrect';
        }
      } else {
        return "L'adresse mail est incorrecte";
      }
    } catch (error) {
      console.error(error);
      return 'err';
    }
  }

  async logout(res: Response): Promise<string> {
    res.clearCookie('auth-token', {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
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
}