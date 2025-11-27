import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateUserDto extends PartialType(CreateUserDto) {}
