import { GraphQLException } from './graphql-exception';

export class UnauthorizedException<T> extends GraphQLException<T> {
  constructor(message: string) {
    super('UNAUTHORIZED', message);
  }
}
