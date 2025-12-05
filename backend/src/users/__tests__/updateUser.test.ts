import { describe, it, expect, vi, Mock } from 'vitest';
import { UsersService } from '../users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { userMock } from 'src/__mocks__/userMock';

vi.mock('bcryptjs');
vi.mock('jsonwebtoken', () => {
  return {
    sign: vi.fn(),
  };
});

const mockBcryptHash = bcrypt.hash as Mock;
const mockJwtSign = jwt.sign as unknown as Mock;

describe('updateUser', () => {
  const activeEmail = userMock.email;

  it('updates the name', async () => {
    const body = { name: 'name1' };

    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: userMock.name,
        email: userMock.email,
        role: userMock.role,
      }),
      updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
    };

    const service = new UsersService(mockUserModel as any);
    const result = await service.updateUser(activeEmail, body);

    expect(result).toEqual({
      message: 'User updated successfully.',
      user: {
        id: userMock.id,
        name: 'name1',
        email: userMock.email,
      },
    });
  });

  it('updates email', async () => {
    process.env.SECRET_KEY = 'key';
    const newEmail = 'newemail@example.com';
    const body = { email: newEmail };

    mockJwtSign.mockReturnValue(userMock.token);

    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: userMock.name,
        email: userMock.email,
        role: userMock.role,
      }),
      updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
    };

    const service = new UsersService(mockUserModel as any);
    const result = await service.updateUser(activeEmail, body);

    expect(result).toEqual({
      message: 'User updated successfully.',
      token: userMock.token,
      user: {
        id: userMock.id,
        name: userMock.name,
        email: newEmail,
        role: userMock.role,
      },
    });
  });

  it('updates password', async () => {
    const body = {
      password: 'Teste1235!',
      confirmPassword: 'Teste1235!',
    };

    mockBcryptHash.mockResolvedValue('hashedPassword123');

    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: userMock.name,
        email: userMock.email,
        role: userMock.role,
      }),
      updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
    };

    const service = new UsersService(mockUserModel as any);

    const result = await service.updateUser(activeEmail, body);

    expect(result).toEqual({
      message: 'User updated successfully.',
      user: {
        id: userMock.id,
        name: userMock.name,
        email: userMock.email,
      },
    });
  });

  it('returns 404 when user is not found', async () => {
    const body = { name: 'name1' };

    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue(null),
    };

    const service = new UsersService(mockUserModel as any);

    await expect(service.updateUser(activeEmail, body)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns 400 when passwords do not match', async () => {
    const body = {
      password: 'Teste12345!',
      confirmPassword: 'Teste123456!',
    };

    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: userMock.name,
        email: userMock.email,
        role: userMock.role,
      }),
    };

    const service = new UsersService(mockUserModel as any);

    await expect(service.updateUser(activeEmail, body)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns 400 when updateOne returns modifiedCount = 0', async () => {
    const body = { name: 'name1' };

    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: userMock.name,
        email: userMock.email,
        role: userMock.role,
      }),
      updateOne: vi.fn().mockResolvedValue({ modifiedCount: 0 }),
    };

    const service = new UsersService(mockUserModel as any);

    await expect(service.updateUser(activeEmail, body)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns 400 when secret key is missing', async () => {
    process.env.SECRET_KEY = '';

    const body = { email: 'newemail@example.com' };

    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({
        _id: userMock.id,
        name: userMock.name,
        email: userMock.email,
        role: userMock.role,
      }),
      updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
    };

    const service = new UsersService(mockUserModel as any);

    await expect(service.updateUser(activeEmail, body)).rejects.toThrow(
      BadRequestException,
    );
  });
});
