import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { KeysModule } from './keys/keys.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UserroleModule } from './userrole/userrole.module';
import { RolepermissionModule } from './rolepermission/rolepermission.module';
import { AddressModule } from './address/address.module';
import { RepositoriesModule } from 'y/repositories';

@Module({
  imports: [UsersModule, KeysModule, RolesModule, PermissionsModule, UserroleModule, RolepermissionModule, AddressModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
