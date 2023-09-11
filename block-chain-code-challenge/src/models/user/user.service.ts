import { Injectable } from '@nestjs/common';
import { UserRepo } from "./repositories/user.repo";
import { UtilsService } from "../../common/utils/utils.service";
import {CreateUserDto} from "./dto/create-user/create-user.dto";
import {User} from "./schemas/user.schema";

@Injectable()
export class UserService {

  /**
   *
   * @param repo
   * @param utils
   */
  constructor(
    private readonly repo: UserRepo,
    private readonly utils: UtilsService
  ) { }

  /**
   *  create user
   * @param user
   */
  async createUser(user: {walletAddress: string }): Promise<User> {
    return await this.repo.createUser(user);
  }

  /**
   * find user by I'd
   * @param id
  //  */
  async getUser(id: string): Promise<User> {
    return await this.repo.getUser(id);
  }

  /**
   * find user by I'd
   * @param attribute
   //  */
  async findByAttribute(attribute: object): Promise<User> {
    return await this.repo.findByAttribute(attribute);
  }
}
