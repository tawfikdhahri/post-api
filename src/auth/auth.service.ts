import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterRequestDto } from './dtos/requests/register-request.dto';
import { RegisterResponseDto } from './dtos/response/register-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // login
  async login(user: any): Promise<{ token: string } | null> {
    const { email, password } = user;

    const validatedUser = await this.validateUser(email, password);
    if (!validatedUser)
      throw new HttpException('Credentials invalid!', HttpStatus.UNAUTHORIZED);

    const jwt = await this.jwtService.signAsync({ validatedUser });
    return { token: jwt };
  }

  //Register
  async register(user: RegisterRequestDto): Promise<RegisterResponseDto | any> {
    const { name, email, password } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser)
      throw new HttpException(
        'An account with that email already exists!',
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(name, email, hashedPassword);
    return this.userService.getUserDetails(newUser);
  }

  // validate the user by checkinbg email and password
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return this.userService.getUserDetails(user);
  }

  //compare password and the hashed pwd
  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
