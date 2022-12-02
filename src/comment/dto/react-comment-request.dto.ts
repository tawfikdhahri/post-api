import { IsEnum, IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';

export enum ReactionType {
  like = 'like',
  dislike = 'dislike',
}
export class ReactToCommentRequestDto {
  @IsEnum(ReactionType)
  type: ReactionType;
}
