import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(8, 16)
  password: string;
}
