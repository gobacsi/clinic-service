import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { configService } from '../../configs/config.service';

@Injectable()
export class Logger {
  protected logLevel: string;
  public logger: winston.Logger;
  constructor() {
    this.logLevel = configService.LOG_LEVEL;
    this.logger = winston.createLogger({
      level: this.logLevel,
      format: winston.format.printf(({ message }) => message),
      transports: [new winston.transports.Console({ level: this.logLevel })],
    });
  }

  isDebugEnabled(): boolean {
    return this.logger.levels[this.logLevel] >= this.logger.levels['debug'];
  }

  error(message: unknown, context?: unknown): void {
    this.write('error', message, context);
  }

  warn(message: unknown, context?: unknown): void {
    this.write('warn', message, context);
  }

  log(message: unknown, context?: unknown): void {
    this.write('info', message, context);
  }

  verbose(message: unknown, context?: unknown): void {
    this.write('verbose', message, context);
  }

  debug(message: unknown, context?: unknown): void {
    this.write('debug', message, context);
  }

  write(level: string, message: unknown, context?: unknown): void {
    const timestamp = new Date().toISOString();
    const log = {
      timestamp,
      message: this.format(message, context),
      level,
    };
    this.logger.log(level, JSON.stringify(log));
  }

  private format(message: unknown, context?: unknown) {
    if (message instanceof Error) {
      return {
        name: message.name,
        message: message.message,
        stack: message.stack,
      };
    }
    return { detail: message, context };
  }
}
