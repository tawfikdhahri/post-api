import { Schema } from 'mongoose';
import { Reaction } from 'src/comment/comment.schema';
import { Post } from 'src/posts/post.schema';
import { User } from 'src/user/user.schema';

export class CommentResponseDto {
  id: Schema.Types.ObjectId;
  text: string;
  post: Post;
  reaction: Reaction;
  author: User;
}
