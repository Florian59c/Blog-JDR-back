import { Controller, Body, Post, } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendMailDto } from './dto/send-mail.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) { }

  @Post('send')
  sendMail(@Body() sendMailDto: SendMailDto) {
    return this.mailerService.sendMail(sendMailDto);
  }

  @Post('forgotPassword')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.mailerService.forgotPassword(forgotPasswordDto);
  }
}