import { HttpStatus } from '../common.constants';
import { ApiException } from './api-exception';

export class ForbiddenException<T> extends ApiException<T> {
  constructor(errorCode: string, errorMessage?: string, data?: T, originError?: Error) {
    super(HttpStatus.FORBIDDEN, errorCode, errorMessage, data, originError);
  }
}
