import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// export type User = {
// 	id: number;
// 	email: string;
// 	username: string;
// 	password: string;
// }

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}
	// private readonly users: User[];

	async findOneUsername(username: string): Promise<any> {
		return await this.prisma.user.findUnique({
			where: {
				username: username
			}
		});
	}
}