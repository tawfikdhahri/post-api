import {
  IsEmail,
  IsNotEmpty,
  Length,
  IsDateString,
  Matches,
} from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(8, 16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'password at least one uppercase letter, one lowercase letter and one number:',
  })
  password: string;
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;
}
