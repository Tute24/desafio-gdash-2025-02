import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user-schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(body: CreateUserDto) {
    const checkExistingEmail = await this.userModel.findOne({
      email: body.email,
    });
    if (checkExistingEmail)
      throw new ConflictException(
        `There's already an user with this e-mail address.`,
      );
    if (body.password !== body.confirmPassword)
      throw new BadRequestException('Passwords must be equal.');

    const passwordHash = await bcrypt.hash(body.password, 10);

    const newUser = await this.userModel.create({
      email: body.email,
      name: body.name,
      password: passwordHash,
    });

    if (!newUser)
      throw new BadRequestException(
        'There was a problem when creating the new user',
      );
    const secretKey = process.env.SECRET_KEY;
    if (secretKey) {
      const token = jwt.sign(
        {
          sub: newUser._id.toString(),
          email: newUser.email,
        },
        secretKey,
        { expiresIn: '1d' },
      );

      return {
        message: 'User created successfully.',
        token: token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      };
    } else {
      throw new BadRequestException('Secret Key is missing.');
    }
  }

  async signIn(body: SignInDto) {
    const user = await this.userModel.findOne({ email: body.email });
    if (!user)
      throw new NotFoundException(
        `There isn't an user with this e-mail address.`,
      );
    if (!(await bcrypt.compare(body.password, user.password)))
      throw new UnauthorizedException('Incorrect password. Try Again');

    const secretKey = process.env.SECRET_KEY;
    if (secretKey) {
      const token = jwt.sign(
        {
          sub: user._id.toString(),
          email: user.email,
        },
        secretKey,
        { expiresIn: '1d' },
      );

      return {
        message: 'User signed in successfully.',
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      };
    } else {
      throw new BadRequestException('Secret Key is missing.');
    }
  }
}
