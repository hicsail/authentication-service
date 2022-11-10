import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from './enum/role.enum';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserService } from './user.service';

@Controller(`user`)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  // TODO: remove this temp function
  @Get(`temp`)
  registerTmpUsers(): void {
    this.userService.createTempUsers();
  }

  // TODO: remove this function after merging with AuthServcie
  @Post(`email`)
  async loginEmail(@Body() body: { project_id: string; email: string }): Promise<string> {
    const user = await this.userService.findUserByEmail(body.project_id, body.email);
    return this.jwtService.sign({ id: user.id, project_id: user.project_id, role: user.role });
  }

  // TODO: remove this function after merging with AuthService
  @Post(`username`)
  async loginUsername(@Body() body: { project_id: string; username: string }): Promise<string> {
    const user = await this.userService.findUserByUsername(body.project_id, body.username);
    return this.jwtService.sign({ id: user.id, project_id: user.project_id, role: user.role });
  }

  @Get(`me`)
  @UseGuards(JwtAuthGuard)
  async getMyInfo(@Request() req): Promise<User> {
    return await this.userService.findUserById(req.user.id);
  }

  @Get(`:id`)
  @Roles(Role.admin)
  async getUserInfo(@Param('id') id: string): Promise<User> {
    return await this.userService.findUserById(id);
  }

  @Post(`:id/add-role`)
  @Roles(Role.admin)
  async addRoleToUser(@Param('id') id: string, @Body('role') role: number): Promise<void> {
    await this.userService.updateUserRole(id, role, true);
  }

  @Delete(`:id/remove-role`)
  @Roles(Role.admin)
  async removeRoleFromUser(@Param('id') id: string, @Body('role') role: number): Promise<void> {
    await this.userService.updateUserRole(id, role, false);
  }
}
