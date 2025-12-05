import { describe, it, expect, vi, Mock } from 'vitest';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { userMock } from 'src/__mocks__/userMock';
import { BadRequestException, ConflictException } from '@nestjs/common';

vi.mock('bcryptjs');

vi.mock('jsonwebtoken', () => {
  return {
    sign: vi.fn(),
  };
});

const mockJwtSign = jwt.sign as unknown as Mock;
const mockBcryptHash = bcrypt.hash as Mock;
describe('createUser', () => {
  const dto: CreateUserDto = {
    name: userMock.name,
    email: userMock.email,
    password: userMock.password,
    confirmPassword: userMock.password,
    role: 'user',
  };

  it('creates a new user successfully', async () => {
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: dto.name,
        email: dto.email,
        role: 'user',
      }),
    };
    process.env.SECRET_KEY = 'key';

    mockBcryptHash.mockResolvedValue('hashedPassword');
    mockJwtSign.mockReturnValue(userMock.token);

    const service = new AuthService(mockUserModel as any);
    const result = await service.createUser(dto);

    expect(result).toEqual({
      message: 'User created successfully.',
      token: userMock.token,
      user: {
        id: userMock.id,
        name: dto.name,
        email: dto.email,
        role: 'user',
      },
    });
  });

  it('returns 409', async () => {
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({ email: dto.email }),
      create: vi.fn(),
    };

    const service = new AuthService(mockUserModel as any);
    await expect(service.createUser(dto)).rejects.toThrow(ConflictException);
  });

  it('returns 400 if passwords do not match', async () => {
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue(null),
    };
    const dtoMismatch: CreateUserDto = {
      name: userMock.name,
      email: userMock.email,
      password: userMock.password,
      confirmPassword: 'Teste123456!',
      role: 'user',
    };

    const service = new AuthService(mockUserModel as any);
    await expect(service.createUser(dtoMismatch)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns 400 when creating the user', async () => {
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(null),
    };

    const service = new AuthService(mockUserModel as any);
    await expect(service.createUser(dto)).rejects.toThrow(BadRequestException);
  });

  it('returns 400 when secret key is missing', async () => {
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: dto.name,
        email: dto.email,
        role: 'user',
      }),
    };
    process.env.SECRET_KEY = '';

    mockBcryptHash.mockResolvedValue('hashedPassword');

    const service = new AuthService(mockUserModel as any);
    await expect(service.createUser(dto)).rejects.toThrow(BadRequestException);
  });
});
