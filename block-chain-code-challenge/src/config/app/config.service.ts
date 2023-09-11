import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {

  /**
   *
   * @param configService
   */
  constructor(private readonly configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>('app.name');
  }

  get env(): string {
    return this.configService.get<string>('app.env');
  }

  get url(): string {
    return this.configService.get<string>('app.url');
  }

  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }

  get workers(): number {
    return +this.configService.get<number>('app.workers')
  }

  get saltOrRounds(): number {
    return +this.configService.get<number>('app.saltOrRounds')
  }

  get jwtSecret(): string {
    return this.configService.get<string>('app.jwtSecret')
  }

  get jwtExpTime(): number {
    return +this.configService.get<number>('app.jwtExpTime')
  }
}
