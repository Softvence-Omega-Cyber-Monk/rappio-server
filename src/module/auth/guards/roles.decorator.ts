import { SetMetadata } from '@nestjs/common';

// Use the same enum as your Prisma schema: import { UserRole } from '@prisma/client'
export const ROLES_KEY = 'roles';
// Accept string[] or enum values
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
