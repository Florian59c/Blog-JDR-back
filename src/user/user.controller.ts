import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetEmailDto } from './dto/get-email.dto';
import { FindUserByIdDto } from './dto/find-user-by-id.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('createUser')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
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

  @Post('updatePassword')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePasswordDto);
  }
}