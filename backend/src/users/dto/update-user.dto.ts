import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @ValidateIf((dto) => dto.password !== undefined)
  @IsStrongPassword()
  password?: string;

  @ValidateIf((dto) => dto.password !== undefined)
  @IsStrongPassword()
  confirmPassword?: string;
}
