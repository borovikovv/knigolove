import { Controller, Post, Body, Param, Get, Patch, Delete, Query, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  createUser(@Body() { email, password }: CreateUserDto) {
    this.userService.create(email, password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    const user =  this.userService.findOne(parseInt(id));
    if(!user) {
      throw new NotFoundException('not found user');
    }

    return user;
  }

  @Get()
  finAll(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
