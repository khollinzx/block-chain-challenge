import MongooseSchema from "mongoose";

export interface UserInterface {
  _id?: MongooseSchema.Types.ObjectId;
  walletAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
