import { UserInterface } from "../interfaces/user.interface";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import MongooseSchema, { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User implements UserInterface {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  walletAddress?: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
