import { HttpStatus } from '../common.constants';
import { ApiException } from './api-exception';

export class InternalServerException<T> extends ApiException<T> {
  constructor(errorCode: string, errorMessage?: string, data?: T, originError?: Error) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, errorCode, errorMessage, data, originError);
  }
}
