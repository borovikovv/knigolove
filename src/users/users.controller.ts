import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  Query,
  NotFoundException,
  Session,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptops';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthenticationGuard from 'src/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/dtos/signin.dto';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  finAll(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('me')
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    if (!user) {
      throw new NotFoundException('not found user');
    }
    user.password = undefined;
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('not found user');
    }
    return user;
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Session() session: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(
      session.userId,
      file.buffer,
      file.originalname,
    );
  }
}
