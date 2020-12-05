import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

// APP_GUARD는 nestjs가 내장하고 있는 constant인데 이 상수는 모든 resolver에게 전부 다
//useValue를 적용할 것이란 얘기 즉, 모든 resolver에게 AuthGuard를 적용한다는 뜻임
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useValue: AuthGuard,
    },
  ],
})
export class AuthModule {}
