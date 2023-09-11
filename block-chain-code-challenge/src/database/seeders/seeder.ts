import { Injectable } from "@nestjs/common";
import { AppConfigService } from "../../config/app/config.service";

@Injectable()
export class Seeder {

  /**
   *
   * @private
   */
  private environments: string[] = ['local', 'staging', 'development', 'dev'];

  /**
   *
   * @param appConfigService
   */
  constructor(
    private readonly appConfigService: AppConfigService
  ) { }

  /**
   * This is called upon to seed all default senders
   */
  async seed() {
    /*
    |--------------------------------------------------------------------------
    | Run the below on any environment
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Run the below only on the accepted environments
    |--------------------------------------------------------------------------
    */
    if (this.environments.includes(this.appConfigService.env)) {

    }
  }
}
