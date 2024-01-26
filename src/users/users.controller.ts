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
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from 'src/interceptops';
import { CurrectUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignInUserDto } from './dtos/sign-in.dto';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body() { email, password, first_name, last_name, role }: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signup(
      email,
      password,
      first_name,
      last_name,
      role,
    );
    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signin(
    @Body() { email, password }: SignInUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signin(email, password);
    session.userId = user.id;

    return user;
  }

  @Get('who')
  async whoIAm(@CurrectUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
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
