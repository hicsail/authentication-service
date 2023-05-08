import { Resolver } from '@nestjs/graphql';
import { InviteModel } from './model/invite.model';

@Resolver(() => InviteModel)
export class InviteResolver {}
