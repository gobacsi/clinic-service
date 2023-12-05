import { Inject, Injectable } from '@nestjs/common';
import retry, { Options } from 'async-retry';
import { AxiosError, AxiosRequestConfig, AxiosResponse, default as axios } from 'axios';
import { ClassConstructor, plainToClass, plainToClassFromExist } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { CUSTOM_PROVIDER, ErrorCode } from './common.constants';
import { ApiException, IError, InternalServerException } from './exceptions';
import { Logger } from './logger';

export interface HttpRequestConfig<T> {
  url: string;
  classType?: ClassConstructor<T>;
  instanceType?: T;
  axiosConfig?: AxiosRequestConfig;
  retryOptions?: Options;
  skipLogResponse?: boolean;
}

export interface HttpConfig {
  validateStatus?(status: number): boolean;
  errorHandling?(error: AxiosError): ApiException<any>;
}

@Injectable()
export class HttpClient {
  private readonly defaultRetryOptions: Options = {
    retries: 2,
    maxRetryTime: 90000,
  };
  constructor(
    @Inject(CUSTOM_PROVIDER.HTTP_CONFIG) private readonly httpConfig: HttpConfig,
    private readonly logger: Logger,
  ) {
    this.customValidateStatus = this.httpConfig?.validateStatus || this.customValidateStatus;
    this.handleError = httpConfig?.errorHandling || this.handleError;
    axios.interceptors.request.use(
      (config) => {
        config.validateStatus = this.customValidateStatus;
        return config;
      },
      (error) => {
        throw this.handleError(error);
      },
    );
  }

  async get<T extends object>(httpRequestConfig: HttpRequestConfig<T>): Promise<T> {
    const {
      url,
      classType,
      instanceType,
      axiosConfig,
      retryOptions = this.defaultRetryOptions,
      skipLogResponse,
    } = httpRequestConfig;
    const requestId: string = uuid();
    try {
      const response = await retry<AxiosResponse<T>>(
        async (bait) => {
          try {
            this.logger.log('[restful-client]: start get request', {
              requestId,
              url,
              params: axiosConfig?.params,
            });
            const res = await axios.get<T, AxiosResponse<T>>(url, this.getAxiosConfig(axiosConfig));
            this.logger.log('[restful-client]: end get request', {
              requestId,
              response: !skipLogResponse ? res.data : '',
            });
            return res;
          } catch (error) {
            this.logger.error(`[restful-client]: get request error`, {
              requestId,
              error,
            });
            if (error?.response?.status < 500) {
              bait(error);
            } else {
              throw error;
            }
          }
        },
        {
          ...this.defaultRetryOptions,
          ...retryOptions,
        },
      );
      if (classType || instanceType) {
        return this.convertAndValidateResponse<T>(response.data, classType, instanceType);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, requestId);
    }
  }

  async post<T extends object>(httpRequestConfig: HttpRequestConfig<T>, body: any): Promise<T> {
    const requestId: string = uuid();
    try {
      const {
        url,
        classType,
        instanceType,
        axiosConfig,
        retryOptions = this.defaultRetryOptions,
        skipLogResponse,
      } = httpRequestConfig;
      const response = await retry<AxiosResponse<T>>(
        async (bait) => {
          try {
            this.logger.log('[restful-client]: start post request', {
              requestId,
              url,
              body,
            });
            const res = await axios.post<T, AxiosResponse<T>>(
              url,
              body,
              this.getAxiosConfig(axiosConfig),
            );
            this.logger.log('[restful-client]: end post request', {
              requestId,
              response: !skipLogResponse ? res.data : '',
            });
            if ((res.data as any).errors?.length) {
              throw (res.data as any).errors[0].extensions;
            }
            return res;
          } catch (error) {
            this.logger.error(`[restful-client]: post request error`, {
              requestId,
              error,
            });
            if (error?.response?.status >= 500) {
              throw error;
            } else {
              bait(error);
            }
          }
        },
        {
          ...this.defaultRetryOptions,
          ...retryOptions,
        },
      );
      if (classType || instanceType) {
        return this.convertAndValidateResponse<T>(response.data, classType, instanceType);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, requestId);
    }
  }

  async put<T extends object>(httpRequestConfig: HttpRequestConfig<T>, body: any): Promise<T> {
    const {
      url,
      classType,
      instanceType,
      axiosConfig,
      retryOptions = this.defaultRetryOptions,
      skipLogResponse,
    } = httpRequestConfig;
    const requestId: string = uuid();
    try {
      const response = await retry<AxiosResponse<T>>(
        async (bait) => {
          try {
            this.logger.log('[restful-client]: start put request', {
              requestId,
              url,
              body,
            });
            const res = await axios.put<T, AxiosResponse<T>>(
              url,
              body,
              this.getAxiosConfig(axiosConfig),
            );
            this.logger.log('[restful-client]: end put request', {
              requestId,
              response: !skipLogResponse ? res.data : '',
            });
            return res;
          } catch (error) {
            this.logger.error(`[restful-client]: put request error`, {
              requestId,
              error,
            });
            if (error?.response?.status >= 500) {
              throw error;
            } else {
              bait(error);
            }
          }
        },
        {
          ...this.defaultRetryOptions,
          ...retryOptions,
        },
      );
      if (classType || instanceType) {
        return this.convertAndValidateResponse<T>(response.data, classType, instanceType);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, requestId);
    }
  }

  async patch<T extends object>(httpRequestConfig: HttpRequestConfig<T>, body: any): Promise<T> {
    const {
      url,
      classType,
      instanceType,
      axiosConfig,
      retryOptions = this.defaultRetryOptions,
      skipLogResponse,
    } = httpRequestConfig;
    const requestId: string = uuid();
    try {
      const response = await retry<AxiosResponse<T>>(
        async (bait) => {
          try {
            this.logger.log('[restful-client]: start patch request', {
              requestId,
              url,
              body,
            });
            const res = await axios.patch<T, AxiosResponse<T>>(
              url,
              body,
              this.getAxiosConfig(axiosConfig),
            );
            this.logger.log('[restful-client]: end patch request', {
              requestId,
              response: !skipLogResponse ? res.data : '',
            });
            return res;
          } catch (error) {
            this.logger.error(`[restful-client]: patch request error`, {
              requestId,
              error,
            });
            if (error?.response?.status >= 500) {
              throw error;
            } else {
              bait(error);
            }
          }
        },
        {
          ...this.defaultRetryOptions,
          ...retryOptions,
        },
      );
      if (classType || instanceType) {
        return this.convertAndValidateResponse<T>(response.data, classType, instanceType);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, requestId);
    }
  }

  async delete<T extends object>(httpRequestConfig: HttpRequestConfig<T>): Promise<T> {
    const requestId: string = uuid();
    try {
      const {
        url,
        classType,
        instanceType,
        axiosConfig,
        retryOptions = this.defaultRetryOptions,
        skipLogResponse,
      } = httpRequestConfig;
      const response = await retry<AxiosResponse<T>>(
        async (bait) => {
          this.logger.log('[restful-client]: start delete request', {
            requestId,
            url,
          });
          try {
            const res = await axios.delete<T, AxiosResponse<T>>(
              url,
              this.getAxiosConfig(axiosConfig),
            );
            this.logger.log('[restful-client]: end delete request', {
              requestId,
              response: !skipLogResponse ? res.data : '',
            });
            return res;
          } catch (error) {
            this.logger.error(`[restful-client]: delete request error`, {
              requestId,
              error,
            });
            if (error?.response?.status >= 500) {
              throw error;
            } else {
              bait(error);
            }
          }
        },
        {
          ...this.defaultRetryOptions,
          ...retryOptions,
        },
      );
      if (classType || instanceType) {
        return this.convertAndValidateResponse<T>(response.data, classType, instanceType);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, requestId);
    }
  }

  private handleError(error: AxiosError<IError<any>>, requestId?: string): ApiException<any> {
    if (error.response) {
      const errorCode =
        error.response.data?.errors?.[0]?.extensions?.code || ErrorCode.UNKNOWN_EXCEPTION;
      const message = error.response.data?.errors?.[0]?.message;
      return new ApiException(
        error.response.status,
        errorCode,
        message,
        error.response.data,
        error,
        requestId,
      );
    } else {
      return new InternalServerException(ErrorCode.UNKNOWN_EXCEPTION, null, null, error);
    }
  }

  private getAxiosConfig(axiosConfig: AxiosRequestConfig): AxiosRequestConfig {
    const defaultHeader = {
      'content-type': 'application/json',
    };

    const config = axiosConfig || {};
    const headers = this.normalizeHeader(config.headers);
    config.headers = {
      ...defaultHeader,
      ...headers,
    };

    return config;
  }

  private async convertAndValidateResponse<T extends object>(
    response: object,
    classType: ClassConstructor<T>,
    instanceType: T,
  ): Promise<T> {
    const result = classType
      ? plainToClass(classType, response)
      : plainToClassFromExist(instanceType, response);

    try {
      await validateOrReject(result);
    } catch (error) {
      throw new InternalServerException(ErrorCode.HTTP_RESPONSE_INVALID, error);
    }

    return result;
  }

  private customValidateStatus(status: number): boolean {
    return status < 400;
  }

  private normalizeHeader(headers: object): any {
    if (!headers) {
      return {};
    }

    return Object.keys(headers).reduce(function (newObj, key) {
      const val = headers[key];
      const newVal = typeof val === 'object' ? this.normalizeHeader(val) : val;
      newObj[key.toLocaleLowerCase()] = newVal;
      return newObj;
    }, {});
  }
}
