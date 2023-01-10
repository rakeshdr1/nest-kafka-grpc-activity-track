import { Module } from '@nestjs/common';

import { ActivityModule } from './modules/activity/activity.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, ActivityModule],
})
export class AppModule {}
