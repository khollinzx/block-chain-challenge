import { Document, FilterQuery, Model, UpdateQuery } from "mongoose";
import mongoose from "mongoose";
import { RepositoryInterface } from "./repository.interface";

export abstract class RepositoryAbstract<T extends Document> implements RepositoryInterface<T>
{

  /**
   *
   * @param model
   */
  protected constructor(public readonly model: Model<T>) {}

  /**
   *
   * @param createDto
   * @param session
   */
  async createRecord(createDto: T | any, session: mongoose.mongo.ClientSession = null): Promise<T | null> {
    const object = new this.model(createDto);
    return await object.save({ session });
  }

  /**
   *
   * @param filterQuery
   * @param session
   */
  async deleteManyByCondition(filterQuery: FilterQuery<T>, session: mongoose.mongo.ClientSession = null): Promise<boolean> {
    const deleteResult = await this.model.deleteMany(filterQuery, { session });
    return deleteResult.deletedCount >= 1;
  }

  /**
   *
   * @param id
   * @param session
   */
  async deleteModelById(id: string, session: mongoose.mongo.ClientSession = null): Promise<boolean> {
    const deleteResult = await this.model.deleteOne({ _id: id }, { session });
    return deleteResult.deletedCount >= 1;
  }

  /**
   *
   * @param filterQuery
   * @param populate
   * @param columns
   */
  async findOne(
      filterQuery: FilterQuery<T[] | object> = {}
  ): Promise<T[]> {
    return await this.model.find(filterQuery).exec();
  }
  /**
   *
   * @param filterQuery
   * @param populate
   * @param columns
   */
  async findAll(
      filterQuery: FilterQuery<T[] | object> = {},
      populate: any = null,
      columns: any = {}
  ): Promise<T[]> {
    return await this.model.find(filterQuery).populate(populate).exec();
  }

  /**
   *
   * @param filterQuery
   * @param updateEntityDto
   * @param session
   */
  findManyAndUpdate = async (
    filterQuery: FilterQuery<T>,
    updateEntityDto: UpdateQuery<T>,
    session: mongoose.mongo.ClientSession = null
  ): Promise<any> => {
    await this.model.updateMany(filterQuery, { $set : updateEntityDto }, { session });
  }

  /**
   *
   * @param filterQuery
   * @param updateEntityDto
   * @param session
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateEntityDto: UpdateQuery<T>,
    session: mongoose.mongo.ClientSession = null
  ): Promise<T> {
    return this.model.findOneAndUpdate(filterQuery, updateEntityDto, {
      new: true,
      session
    })
  }

  /**
   *
   * @param filterQuery
   * @param populate
   */
  async findOneByCondition(filterQuery: FilterQuery<T | null>, populate: any = null): Promise<T | null> {
    const result = await this.model.findOne(filterQuery).exec();

    return result && populate
      ? result.populate(populate)
      : result;
  }


  /**
   *
   * @param filterQuery
   * @param identifier
   * @param keyToSum
   */
  async getSum(filterQuery: FilterQuery<T>, identifier: string, keyToSum: string): Promise<number> {
    return this.model.aggregate([
      { $match: filterQuery },
      { $group: {
          _id: null,
          [ identifier ]: { $sum: `$${ keyToSum }` },
        },
      },
    ]).then(rec => rec.length ? rec[0][ identifier ] : 0);
  }

  /**
   * Count the total of a particular Collection
   *
   * @param filterQuery
   */
  getTotalCount = async (filterQuery: FilterQuery<T> = null): Promise<number> => {
    return this.model.find(filterQuery).countDocuments();
  }
}
