import { Injectable } from "@nestjs/common";
import { RepositoryAbstract } from "../../../common/repository/repository.abstract";
import { User, UserDocument } from "../schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {CreateUserDto} from "../dto/create-user/create-user.dto";

@Injectable()
export class UserRepo extends RepositoryAbstract<UserDocument> {
  /**
   *
   * @param model
   */
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }

  /**
   *  create user
   * @param payload
   */
  async createUser(payload: object): Promise<User> {
    const createdUser = new this.model(payload);
    return createdUser.save();
  }

  /**
   *  get user by _Id
   * @param id
   */
  async getUser(id: string): Promise<User> {
    return this.model.findById({_id: id});
  }

  /**
   *  get user by attribute
   * @param attribute
   */
  async findByAttribute(attribute: object): Promise<User> {
    return this.model.findOne(attribute);
  }


}
