import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetEmailDto } from './dto/get-email.dto';
import { FindUserByIdDto } from './dto/find-user-by-id.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Request, Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('createUser')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('getCurrentUser')
  getCurrentUser(@Req() req: Request) {
    const token = req.cookies['auth-token'];
    return this.userService.getCurrentUser(token);
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

  @Post('updateUser')
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const token = req.cookies['auth-token'];
    return this.userService.updateUser(updateUserDto, token);
  }

  @Post('updatePassword')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePasswordDto);
  }

  @Post('deleteUser')
  deleteUser(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['auth-token'];
    return this.userService.deleteUser(token, res);
  }
}