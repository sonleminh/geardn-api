import { SetMetadata } from '@nestjs/common';
import { RBAC } from '../enums/rbac.enum';

export const Roles = (...args: RBAC[]) => SetMetadata('roles', args);