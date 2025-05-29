import { Controller, Get, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetEmailDto } from './dto/get-email.dto';
import { FindUserByIdDto } from './dto/find-user-by-id.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Request, Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FindUserByPseudoDto } from './dto/find-user-by-pseudo.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('createUser')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('getCurrentUser')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() req: Request) {
    return this.userService.getCurrentUser(req['user']);
  }

  @Get('getAllUsers')
  findAll() {
    return this.userService.findAll();
  }

  @Post('findUserByMail')
  findEmail(@Body() getEmailDto: GetEmailDto) {
    return this.userService.findUserByMail(getEmailDto);
  }

  @Post('findUserById')
  findUserById(@Body() findUserByIdDto: FindUserByIdDto) {
    return this.userService.findUserById(findUserByIdDto);
  }

  @Post('findUserByPseudo')
  // @UseGuards(AdminGuard)
  findUserByPseudo(@Body() findUserByPseudoDto: FindUserByPseudoDto) {
    return this.userService.findUserByPseudo(findUserByPseudoDto);
  }

  @Post('updateUser')
  @UseGuards(JwtAuthGuard)
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.userService.updateUser(updateUserDto, req['user']);
  }

  @Post('updatePassword')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePasswordDto);
  }

  @Post('deleteUser')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.userService.deleteUser(req['user'], res);
  }
}