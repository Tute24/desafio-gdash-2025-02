import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import type { RequestWithUser } from 'src/auth/guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/custom-decorators/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(['admin'])
  @Get('get')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Delete('delete')
  deleteUser(@Req() req: RequestWithUser) {
    return this.usersService.deleteUser(req.user.email);
  }

  @Post('update')
  updateUser(@Req() req: RequestWithUser, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(req.user.email, body);
  }
}
