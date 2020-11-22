import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// Guard는 request를 진행할지 말지 중간에 가로채서 결정해주는 클래스
// 미들웨어의 개념안이지만 쓰임새가 그렇다.
// CanActivate은 true를 return하면 request를 진행하고 false를 return하면 request를 막는다.

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    if (!user) {
      return false;
    }
    return true;
  }
}
