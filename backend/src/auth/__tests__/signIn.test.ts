import { describe, Mock, vi } from 'vitest';
import { SignInDto } from '../dto/sign-in.dto';
import { userMock } from 'src/__mocks__/userMock';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

vi.mock('bcryptjs');

vi.mock('jsonwebtoken', () => {
  return {
    sign: vi.fn(),
  };
});

const mockJwtSign = jwt.sign as unknown as Mock;
const mockBcryptCompare = bcrypt.compare as Mock;

describe('signIn', () => {
  const dto: SignInDto = {
    email: userMock.email,
    password: userMock.password,
  };

  it('signs a user in successfully', async () => {
    process.env.SECRET_KEY = 'key';
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: userMock.name,
        email: dto.email,
        role: 'user',
      }),
    };
    mockBcryptCompare.mockResolvedValue(true);
    mockJwtSign.mockReturnValue(userMock.token);
    const service = new AuthService(mockUserModel as any);
    const result = await service.signIn(dto);

    expect(result).toEqual({
      message: 'User signed in successfully.',
      token: userMock.token,
      user: {
        id: userMock.id,
        name: userMock.name,
        email: dto.email,
        role: 'user',
      },
    });
  });

  it('returns 404 when the user is not on db', async () => {
    process.env.SECRET_KEY = 'key';
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue(null),
    };

    const service = new AuthService(mockUserModel as any);
    await expect(service.signIn(dto)).rejects.toThrow(NotFoundException);
  });

  it('returns 401 on wrong password', async () => {
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: userMock.name,
        email: dto.email,
        role: 'user',
      }),
    };
    mockBcryptCompare.mockResolvedValue(false);
    const service = new AuthService(mockUserModel as any);
    await expect(service.signIn(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('returns 400 when secret key is missing', async () => {
    process.env.SECRET_KEY = '';
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: userMock.name,
        email: dto.email,
        role: 'user',
      }),
    };
    mockBcryptCompare.mockResolvedValue(true);
    mockJwtSign.mockReturnValue(userMock.token);
    const service = new AuthService(mockUserModel as any);
    await expect(service.signIn(dto)).rejects.toThrow(BadRequestException);
  });
});
