import { HttpStatus } from '../common.constants';
import { ApiException } from './api-exception';

export class BadRequestException<T> extends ApiException<T> {
  constructor(errorCode: string, errorMessage?: string, data?: T, originError?: Error) {
    super(HttpStatus.BAD_REQUEST, errorCode, errorMessage, data, originError);
  }
}
