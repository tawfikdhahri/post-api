import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { CommentDocument } from './comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ReactionType,
  ReactToCommentRequestDto,
} from './dto/react-comment-request.dto';
import { CommentResponseDto } from './dto/response/comment-response.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private postService: PostsService,
    private userService: UserService,
    @InjectModel('Comment')
    private readonly CommentModel: Model<CommentDocument>,
  ) {}

  getCommentDetails = (comment: CommentDocument) => {
    return {
      id: comment._id,
      text: comment.text,
      post: comment.post,
      reaction: comment.reaction,
      author: comment.author,
    };
  };
  async create(user: any, { text, postId }: CreateCommentDto) {
    const post = await this.postService.findById(postId);
    if (!post)
      return new NotFoundException(
        'You can not add comment for non-existent post',
      );
    const newPost = new this.CommentModel({
      text,
      author: user.id,
      post: postId,
    });
    return newPost.save();
  }

  // this function is for adding reaction to a comment either like or dislike
  // reaction to post is the same logic thats why i didnt implement it

  async reactToComment(
    commentId: any,
    { type }: ReactToCommentRequestDto,
    user: any,
  ) {
    const comment = await this.findById(commentId);
    const currentUser = await this.userService.findById(user.id);
    if (
      (currentUser.likedComments.includes(commentId) &&
        type === ReactionType.like) ||
      (currentUser.dislikedComments.includes(commentId) &&
        type === ReactionType.dislike)
    ) {
      return new NotAcceptableException();
    } else {
      const newReactionValue =
        type === ReactionType.like
          ? { ...comment.reaction, likeNumber: comment.reaction.likeNumber + 1 }
          : {
              ...comment.reaction,
              dislikeNumber: comment.reaction.dislikeNumber + 1,
            };
      return Promise.all([
        this.userService.updateReactionFields(user.id, type, commentId),
        this.update(commentId, { reaction: newReactionValue }),
      ])
        .then(([a, comment]) => {
          return comment;
        })
        .catch((e) => {
          throw new InternalServerErrorException();
        });
    }
  }

  async findCommentsByPostId(postId): Promise<any[]> {
    const comments = await this.CommentModel.find({ post: postId })
      .populate('author')
      .populate('post');
    return comments.map((comment) => this.getCommentDetails(comment));
  }

  async findById(id: any): Promise<any | null> {
    const comment: any = await this.CommentModel.findById(id)
      .populate('author')
      .populate('post');

    if (!comment) return null;
    return this.getCommentDetails(comment);
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.CommentModel.findOneAndUpdate({ id }, updateCommentDto, {
      new: true,
    }).then((res) => {
      if (res) return res;
      else throw new NotFoundException('Comment does not exist');
    });
  }

  async remove(id: number) {
    return this.CommentModel.findOneAndDelete({ id }).then((res) => {
      if (res) return true;
      else throw new NotFoundException('Comment does not exist');
    });
  }
}
