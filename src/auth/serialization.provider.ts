import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }
  serializeUser(
    user: User,
    done: (err: Error, user: { id: number; role: string }) => void,
  ) {
    done(null, { id: user.id, role: user.role });
  }

  async deserializeUser(
    payload: { id: number; role: string },
    done: (err: Error, user: Omit<User, 'password'>) => void,
  ) {
    const user = await this.usersService.getById(payload.id);
    done(null, user);
  }
}
