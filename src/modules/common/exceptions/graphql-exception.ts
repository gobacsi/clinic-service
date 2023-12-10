import { GraphQLError } from 'graphql';

export class GraphQLException<T> extends GraphQLError {
  constructor(errorCode: string, errorMessage?: string, originError?: Error, errorData?: T) {
    // replace errorData to errorMessage
    super(errorMessage || errorCode, null, null, null, null, originError, {
      code: errorCode,
      data: errorData,
    });
  }
}
