import { HttpStatus } from '../common.constants';
import { ApiException } from './api-exception';

export class UnauthorizedException<T> extends ApiException<T> {
  constructor(errorCode: string, errorMessage?: string, data?: T, originError?: Error) {
    super(HttpStatus.UNAUTHORIZED, errorCode, errorMessage, data, originError);
  }
}
