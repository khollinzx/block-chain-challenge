import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoConfigService {
  /**
   *
   * @param configService
   */
  constructor(private readonly configService: ConfigService) {}

  get uri(): string {
    return `${this.configService.get<string>('mongo.uri')}`;
  }
}
