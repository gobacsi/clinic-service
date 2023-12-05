import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { HealthCheckService } from './service';

@Controller('/clinic/health')
export class HealthcheckController {
  constructor(private healthCheckService: HealthCheckService) {}

  @Get()
  async healthcheck(@Res() response: Response) {
    const redisHeatlh = this.healthCheckService.getRedisHealth();
    const postgreHealth = await this.healthCheckService.getPostgreHealth();
    const healthcheckStatus = {
      redisHeatlh,
      postgreHealth,
    };
    if (redisHeatlh && postgreHealth) {
      response.json({ status: 'UP', ...healthcheckStatus });
      return response.json();
    }
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ status: 'DOWN', ...healthcheckStatus });
  }
  @Get('/memory')
  memory(): any {
    const { rss, heapTotal, heapUsed } = process.memoryUsage();
    return {
      rss: rss / (1024 * 1024),
      heapTotal: heapTotal / (1024 * 1024),
      heapUsed: heapUsed / (1024 * 1024),
    };
  }
}
