export interface IError<T> {
  errors: {
    message: string;
    extensions: {
      code: string;
      data?: T;
      exception?: {
        stacktrace?: string;
      };
    };
  }[];
}

export class ApiException<T> extends Error {
  constructor(
    public httpCode: number,
    public errorCode: string,
    public errorMessage?: string,
    public rawData?: T,
    public originError?: Error,
    public requestId?: string,
  ) {
    super();
    this.httpCode = httpCode;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage || errorCode;
    this.originError = originError;
    this.requestId = requestId;
    this.rawData = rawData;
  }

  toDto(): IError<T> {
    return {
      errors: [
        {
          message: this.errorMessage,
          extensions: {
            code: this.errorCode,
            data: this.rawData,
            exception: {
              stacktrace: this.originError?.stack,
            },
          },
        },
      ],
    };
  }
}
