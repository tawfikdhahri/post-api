import { isNotEmpty, IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';
import { Reaction } from '../comment.schema';

export class CreateCommentDto {
  @IsNotEmpty()
  text: string;
  @IsNotEmpty()
  postId: Schema.Types.ObjectId;
  reaction?: Reaction;
}
