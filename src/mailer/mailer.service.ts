import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';

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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const findedUserByMail = await this.userService.findUserByMail({ email });
    if (findedUserByMail) {
      const token = jwt.sign(
        { userId: findedUserByMail.id },
        process.env.JWT_SECRET, // Assure-toi d'avoir une clé secrète dans tes variables d'env
        { expiresIn: '1h' }
      );

      // Construire l'URL de réinitialisation
      const resetUrl = `http://localhost:3000/resetPassword?token=${token}`;
      try {
        await this.transporter.sendMail({
          from: '"No Reply" <noreply.idearium@gmail.com>',
          to: email,
          subject: "Idearium - Réinitialisation de votre mot de passe",
          html: `
          <p>Bonjour,</p>
          <p>Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous :</p>
          <a href="${resetUrl}" target="_blank">Réinitialiser mon mot de passe</a>
          <p>Ce lien est valable 1 heure.</p>
        `,
          replyTo: "", // Désactive la possibilité de répondre
        });
        return "Un mail vous a été envoyé. S'il n'apparaît pas, vérifiez vos spams";
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail: ', error);
        return "Une erreur est survenue lors de l'envoi du mail";
      }
    } else {
      return "L'adresse mail n'a pas été trouvée"
    }
  }
}