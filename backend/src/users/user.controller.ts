import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { RequestWithUser } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Delete('delete')
  deleteUser(@Req() req: RequestWithUser) {
    return this.usersService.deleteUser(req.user.email);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  updateUser(@Req() req: RequestWithUser, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(req.user.email, body);
  }
}
