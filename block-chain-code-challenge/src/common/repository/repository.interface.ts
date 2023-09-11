import mongoose, { Document, FilterQuery, UpdateQuery } from 'mongoose';

export interface RepositoryInterface<T extends Document> {
  /**
   *
   * @param filterQuery
   * @param populate
   * @param columns
   */
  findAll(filterQuery: FilterQuery<T[] | object>, populate: any, columns: any): Promise<T[] | []>;

  /**
   *
   * @param filterQuery
   * @param populate
   */
  findOneByCondition(filterQuery: FilterQuery<T>, populate: any): Promise<T | null>;

  /**
   *
   * @param createDto
   * @param session
   */
  createRecord(createDto: T|any, session: mongoose.mongo.ClientSession): Promise<T|null>;

  /**
   *
   * @param filterQuery
   * @param updateEntityDto
   * @param session
   */
  findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateEntityDto: UpdateQuery<T>,
    session: mongoose.mongo.ClientSession
  ): Promise<T>;

  /**
   *
   * @param filterQuery
   * @param updateEntityDto
   * @param session
   */
  findManyAndUpdate(filterQuery: FilterQuery<T>, updateEntityDto: UpdateQuery<T>, session: mongoose.mongo.ClientSession): Promise<any>;

  /**
   *
   * @param id
   * @param session
   */
  deleteModelById(id: string, session: mongoose.mongo.ClientSession): Promise<boolean>;

  /**
   *
   * @param filterQuery
   * @param session
   */
  deleteManyByCondition(filterQuery: FilterQuery<T>, session: mongoose.mongo.ClientSession): Promise<boolean>;

  /**
   *
   * @param filterQuery
   */
  getTotalCount(filterQuery: FilterQuery<T>): Promise<number>;

  /**
   *
   * @param filterQuery
   * @param identifier
   * @param keyToSum
   */
  getSum(filterQuery: FilterQuery<T>, identifier: string, keyToSum: string): Promise<any>;

}
