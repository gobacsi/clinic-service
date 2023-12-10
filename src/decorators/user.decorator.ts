// user.decorator.ts
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../modules/auth/entities/user.entity';

export const CurrentUser = createParamDecorator((data, context: ExecutionContext): User => {
  const request = GqlExecutionContext.create(context).getContext().req;
  const user = new User();
  user.id = request.res.locals.userId;
  user.phoneNumber = request.res.locals.phone;
  user.username = request.res.locals.username;
  return user;
});
