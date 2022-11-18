import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  @Get('me')
  async getMyInfo(@Request() req): Promise<User> {
    return await this.userService.findUserById(req.user.id);
  }

  @Get()
  @Roles(Role.Admin)
  async getAllUsersFromCurrentProject(@Request() req): Promise<User[]> {
    return await this.userService.findUsersByProjectId(req.user.project_id);
  }

  @Get(':id')
  @Roles(Role.Admin)
  async getUserInfo(@Param('id') id: string): Promise<User> {
    return await this.userService.findUserById(id);
  }

  @Post(':id/add-role')
  @Roles(Role.Admin)
  async addRoleToUser(@Param('id') id: string, @Body('role') role: number): Promise<boolean> {
    try {
      await this.userService.updateUserRole(id, role);
    } catch (error) {
      return false;
    }

    return true;
  }

  @Delete(':id/remove-role')
  @Roles(Role.Admin)
  async removeRoleFromUser(@Param('id') id: string, @Body('role') role: number): Promise<boolean> {
    try {
      await this.userService.updateUserRole(id, role, false);
    } catch (error) {
      return false;
    }

    return true;
  }
}
