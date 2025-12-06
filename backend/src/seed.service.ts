import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users/schema/user-schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createStandardUser() {
    if (process.env.STANDARD_USER_EMAIL && process.env.STANDARD_USER_PASSWORD) {
      const checkStandardUser = await this.userModel.findOne({
        email: process.env.STANDARD_USER_EMAIL,
      });

      if (checkStandardUser)
        return console.log(
          'Standard User already on database',
          checkStandardUser,
        );

      const passwordHash = await bcrypt.hash(
        process.env.STANDARD_USER_PASSWORD,
        10,
      );

      const newStandardUser = await this.userModel.create({
        email: process.env.STANDARD_USER_EMAIL,
        name: process.env.STANDARD_USER_NAME
          ? process.env.STANDARD_USER_NAME
          : 'user',
        password: passwordHash,
        role: 'admin',
      });
      if (!newStandardUser)
        throw new InternalServerErrorException(
          `There was a problem when creating the standard user.`,
        );

      return console.log('Standard user created.', newStandardUser);
    }
  }
}
