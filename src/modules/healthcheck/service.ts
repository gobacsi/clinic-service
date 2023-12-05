import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { RedisService } from '../redis';

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly redisService: RedisService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async getRedisHealth(): Promise<boolean> {
    let isHealthy = true;
    try {
      await this.redisService.ping();
    } catch (error) {
      isHealthy = false;
    }
    return isHealthy;
  }

  async getPostgreHealth(): Promise<boolean> {
    let isHealthy = true;
    try {
      await this.entityManager.query('SELECT 1');
    } catch (error) {
      isHealthy = false;
    }
    return isHealthy;
  }

  // async getKafkaHealth(
  //   kafkaService: KafkaService,
  //   kafkaConfig: KafkaModuleOption,
  // ): Promise<boolean> {
  //   let isHealthy = false;
  //   const {
  //     client: { clientId },
  //     consumer: { groupId },
  //   } = kafkaConfig;
  //   try {
  //     const groupDescriptions = await kafkaService.getDescribeGroups([groupId]);
  //     for (const group of groupDescriptions.groups) {
  //       if (group.members.find((member) => member.clientId === clientId)) {
  //         isHealthy = true;
  //         break;
  //       }
  //     }
  //   } catch (error) {}
  //   return isHealthy;
  // }
}
