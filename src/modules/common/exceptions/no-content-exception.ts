import { HttpStatus } from '../common.constants';
import { ApiException } from './api-exception';

export class NoContentException<T> extends ApiException<T> {
  constructor(errorCode: string, errorMessage?: string, data?: T, originError?: Error) {
    super(HttpStatus.NO_CONTENT, errorCode, errorMessage, data, originError);
  }
}
