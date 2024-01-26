import { ValidateNested } from 'class-validator';
import { User } from '../user.entity';

export class CreateAvatarDto {
  @ValidateNested()
  user: Pick<User, 'id'>;
}
