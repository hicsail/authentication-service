import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/roles.decorator';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectId } from '../project/project.decorator';
import { UserId } from './user.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMyInfo(@UserId() userId: string): Promise<User> {
    try {
      const user = await this.userService.findUserById(userId);
      delete user.password;
      return user;
    } catch (error) {
      throw new HttpException('User ID does not exist', HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  @Roles(Role.Admin)
  async getAllUsersFromCurrentProject(@ProjectId() projectId: string): Promise<User[]> {
    const users = await this.userService.findUsersByProjectId(projectId);
    users.forEach((user) => delete user.password);
    return users;
  }

  @Get(':id')
  @Roles(Role.Admin)
  async getUserInfo(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    try {
      const user = await this.userService.findUserById(id);
      delete user.password;
      return user;
    } catch (error) {
      throw new HttpException('User ID does not exist', HttpStatus.NOT_FOUND);
    }
  }

  @Post(':id/add-role')
  @Roles(Role.Admin)
  async addRoleToUser(@Param('id', new ParseUUIDPipe()) id: string, @Body('role') role: number): Promise<boolean> {
    try {
      await this.userService.updateUserRole(id, role);
    } catch (error) {
      return false;
    }

    return true;
  }

  @Delete(':id/remove-role')
  @Roles(Role.Admin)
  async removeRoleFromUser(@Param('id', new ParseUUIDPipe()) id: string, @Body('role') role: number): Promise<boolean> {
    try {
      await this.userService.updateUserRole(id, role, false);
    } catch (error) {
      return false;
    }

    return true;
  }
}
