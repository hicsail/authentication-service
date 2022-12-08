import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMyInfo(@Req() req): Promise<User> {
    try {
      return await this.userService.findUserById(req.user.id);
    } catch (error) {
      throw new HttpException('User ID does not exist', HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  @Roles(Role.Admin)
  async getAllUsersFromCurrentProject(@Req() req): Promise<User[]> {
    return await this.userService.findUsersByProjectId(req.user.projectId);
  }

  @Get(':id')
  @Roles(Role.Admin)
  async getUserInfo(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    try {
      return await this.userService.findUserById(id);
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
