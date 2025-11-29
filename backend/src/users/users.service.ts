import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user-schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUsers() {
    const users = await this.userModel.find();

    if (!users)
      throw new InternalServerErrorException(
        `Couldn't retrieve the users from the database.`,
      );

    return {
      message: 'Users retrieved successfully.',
      users,
    };
  }

  async deleteUser(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new NotFoundException(`Couldn't find the user on the database.`);
    const isDeleted = await this.userModel.deleteOne({ email: user.email });
    if (isDeleted.deletedCount === 0)
      throw new BadRequestException(`Couldn't delete the user.`);
    return {
      message: 'User deleted sucessfully from the database.',
    };
  }

  async updateUser(activeEmail: string, body: UpdateUserDto) {
    const user = await this.userModel.findOne({ email: activeEmail });
    if (!user)
      throw new NotFoundException(`Couldn't find the user on the database.`);
    let passwordHash: string = '';
    if ('password' in body && body.password !== undefined) {
      if (body.password !== body.confirmPassword)
        throw new BadRequestException('Passwords must be equal.');
      passwordHash = await bcrypt.hash(body.password, 10);
    }

    const updatedData: any = {};
    if (body.name) updatedData.name = body.name;
    if (body.password) updatedData.password = passwordHash;
    if (body.email) updatedData.email = body.email;
    const isUpdated = await this.userModel.updateOne(
      { email: user.email },
      {
        $set: updatedData,
      },
    );

    if (isUpdated.modifiedCount === 0)
      throw new BadRequestException(
        `There was an error when updating the user info.`,
      );

    if (body.email) {
      const secretKey = process.env.SECRET_KEY;
      if (secretKey) {
        const token = jwt.sign(
          {
            sub: user._id.toString(),
            email: body.email,
          },
          secretKey,
          { expiresIn: '1d' },
        );

        return {
          message: 'User updated successfully.',
          token: token,
          user: {
            id: user._id,
            name: body.name ? body.name : user.name,
            email: body.email,
          },
        };
      } else {
        throw new BadRequestException('Secret Key is missing.');
      }
    }

    return {
      message: 'User updated successfully.',
      user: {
        id: user._id,
        name: body.name ? body.name : user.name,
        email: user.email,
      },
    };
  }
}
