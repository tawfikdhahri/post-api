import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  dateOfBirth: string;
  @Prop({ default: [] })
  likedPosts: [MongooseSchema.Types.ObjectId];
  @Prop({ default: [] })
  dislikedPosts: [MongooseSchema.Types.ObjectId];
  @Prop({ default: [] })
  likedComments: [MongooseSchema.Types.ObjectId];
  @Prop({ default: [] })
  dislikedComments: [MongooseSchema.Types.ObjectId];
}

export const UserSchema = SchemaFactory.createForClass(User);
