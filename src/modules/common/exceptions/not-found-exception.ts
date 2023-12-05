import { HttpStatus } from '../common.constants';
import { ApiException } from './api-exception';

export class NotFoundException<T> extends ApiException<T> {
  constructor(errorCode: string, errorMessage?: string, data?: T, originError?: Error) {
    super(HttpStatus.NOT_FOUND, errorCode, errorMessage, data, originError);
  }
}
