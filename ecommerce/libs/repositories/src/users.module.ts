import { Module } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { PrismaService } from 'y/prisma';
import { KeysRepository } from '../users/keys.repository';
import { RolesRepository } from '../users/roles.repository';
import { PermissionsRepository } from '../users/permissions.repository';
import { UserRoleRepository } from '../users/user_role.repository';
import { RolePermissionRepository } from '../users/rolepermission.repository';
import { ConfigModule } from '@nestjs/config';
import { UserAddressRepository } from '../users/user.address.repository';

const repository = [
  UserRepository,
  KeysRepository,
  RolesRepository,
  PermissionsRepository,
  UserRoleRepository,
  RolePermissionRepository,
  UserAddressRepository,
];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [PrismaService, ...repository],
  exports: [...repository],
})
export class UsersModule {}
