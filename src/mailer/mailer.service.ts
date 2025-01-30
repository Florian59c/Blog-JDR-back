import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CONTACT_EMAIL, // Remplacez par votre adresse Gmail
        pass: process.env.APP_PASSWORD, // Utilisez le mot de passe d'application
      },
    });
  }

  async sendMail(sendMailDto: SendMailDto) {
    const { from, subject, content } = sendMailDto;
    try {
      const info = await this.transporter.sendMail({
        from, // Expéditeur
        to: process.env.CONTACT_EMAIL, // Destinataire
        subject, // Sujet de l'e-mail
        text: content, // Contenu en texte brut
        replyTo: from, // Permet au destinataire de répondre à l'expéditeur réel
      });

      console.log('Email envoyé: ', info.messageId);
      return info;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail: ', error);
      throw error;
    }
  }
}