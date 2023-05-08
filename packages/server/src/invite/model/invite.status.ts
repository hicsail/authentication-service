import { registerEnumType } from '@nestjs/graphql';

export enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

registerEnumType(InviteStatus, {
  name: 'InviteStatus',
  description: 'The status of an invite'
});
