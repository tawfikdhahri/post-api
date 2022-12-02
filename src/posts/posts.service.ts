import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/requests/create-post.dto';
import { UpdatePostDto } from './dto/requests/update-post.dto';
import { PostDocument } from './post.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly PostModel: Model<PostDocument>,
  ) {}

  getPostDetails = async (post: PostDocument) => {
    console.log(post.postReactions);

    return {
      text: post.text,
      reaction: post.postReactions,
      date: post.date,
      id: post._id,
    };
  };
  async create({ text }: CreatePostDto) {
    const newPost = new this.PostModel({
      text,
    });
    const post = await newPost.save();
    return this.getPostDetails(post);
  }

  async findAll() {
    return this.PostModel.find();
  }

  async findById(id: any): Promise<any | null> {
    const post = await this.PostModel.findById(id).exec();
    if (!post) return null;
    return {
      id: post._id,
      text: post.text,
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return this.PostModel.findOneAndUpdate({ id }, updatePostDto, {
      new: true,
    }).then((res) => {
      if (res) return res;
      else throw new NotFoundException('Post does not exist');
    });
  }

  async remove(id: number) {
    return this.PostModel.findOneAndDelete({ id }).then((res) => {
      if (res) return true;
      else throw new NotFoundException('Post does not exist');
    });
  }
}
