import { describe, it, expect, vi } from 'vitest';
import { InternalServerErrorException } from '@nestjs/common';
import { userMock } from 'src/__mocks__/userMock';
import { UsersService } from 'src/users/users.service';

describe('getUsers', () => {
  it('retrieves users successfully', async () => {
    const mockUserModel = {
      find: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue(userMock.usersArray),
      }),
    };

    const service = new UsersService(mockUserModel as any);
    const result = await service.getUsers();

    expect(result).toEqual({
      message: 'Users retrieved successfully.',
      users: userMock.usersArray,
    });
  });

  it('returns 500 if db returns null', async () => {
    const mockUserModel = {
      find: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue(null),
      }),
    };

    const service = new UsersService(mockUserModel as any);

    await expect(service.getUsers()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
