import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
import { ResponseMessage } from 'src/interfaces/response.interface';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly userService: UserService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CONTACT_EMAIL, // Remplacez par votre adresse Gmail
        pass: process.env.APP_PASSWORD, // Utilisez le mot de passe d'application
      },
    });
  }

  async sendMail(sendMailDto: SendMailDto): Promise<Boolean> {
    const { from, subject, content } = sendMailDto;

    try {
      await this.transporter.sendMail({
        from, // Expéditeur
        to: process.env.CONTACT_EMAIL, // Destinataire
        subject, // Sujet de l'e-mail
        text: content, // Contenu en texte brut
        replyTo: from, // Permet au destinataire de répondre à l'expéditeur réel
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail: ', error);
      return false;
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<ResponseMessage> {
    const { email } = forgotPasswordDto;

    try {
      const findedUserByMail = await this.userService.findUserByMail({ email });
      if (!findedUserByMail) {
        throw new BadRequestException('L\'adresse mail n\'a pas été trouvée');
      }

      const token = jwt.sign(
        { userId: findedUserByMail.id },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      );

      // création de l'URL de réinitialisation avec un token dans l'url et contenant l'id de l'utilisateur
      const resetUrl = `${process.env.CLIENT_URL}resetPassword?token=${token}`;

      await this.transporter.sendMail({
        from: '"No Reply" <noreply.idearium@gmail.com>',
        to: email,
        subject: "Idearium - Réinitialisation de votre mot de passe",
        html: `
          <p>Bonjour,</p>
          <p>Vous avez demandé une réinitialisation de votre mot de passe. Pour cela, cliquez sur le lien ci-dessous :</p>
          <a href="${resetUrl}" target="_blank">Réinitialiser mon mot de passe</a>
          <p>Ce lien est valable 10 minutes.</p>
        `,
        replyTo: "", // Désactive la possibilité de répondre au mail
      });

      return { message: 'Un mail de réinitialisation vous a été envoyé. S\'il n\'apparaît pas, vérifiez vos spams' };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation : ', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Une erreur est survenue lors de l\'envoi du mail de réinitialisation');
    }
  }
}