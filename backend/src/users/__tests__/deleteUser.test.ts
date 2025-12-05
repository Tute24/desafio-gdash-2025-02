import { describe, it, expect, vi } from 'vitest';
import { UsersService } from '../users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { userMock } from 'src/__mocks__/userMock';

describe('deleteUser', () => {
  it('deletes a user successfully', async () => {
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({
        email: userMock.email,
      }),
      deleteOne: vi.fn().mockResolvedValue({
        deletedCount: 1,
      }),
    };

    const service = new UsersService(mockUserModel as any);

    const result = await service.deleteUser(userMock.email);

    expect(result).toEqual({
      message: 'User deleted sucessfully from the database.',
    });
  });

  it('returns 404 when user is not found in db', async () => {
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue(null),
      deleteOne: vi.fn(),
    };

    const service = new UsersService(mockUserModel as any);

    await expect(service.deleteUser(userMock.email)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns 400 when deletion fails', async () => {
    const mockUserModel = {
      findOne: vi.fn().mockResolvedValue({ email: userMock.email }),
      deleteOne: vi.fn().mockResolvedValue({
        deletedCount: 0,
      }),
    };

    const service = new UsersService(mockUserModel as any);

    await expect(service.deleteUser(userMock.email)).rejects.toThrow(
      BadRequestException,
    );
  });
});
