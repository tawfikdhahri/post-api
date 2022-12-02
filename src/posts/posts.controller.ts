import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/requests/create-post.dto';
import { UpdatePostDto } from './dto/requests/update-post.dto';
import { PostResponseDto } from './dto/response/post-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('posts')
// @UseGuards(JwtGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post('create')
  create(@Body() createPostDto: CreatePostDto) {
    try {
      return this.postsService.create(createPostDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get()
  findAll(): Promise<any[]> {
    try {
      return this.postsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostResponseDto> {
    try {
      return this.postsService.findById(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    try {
      return this.postsService.update(+id, updatePostDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    try {
      return this.postsService.remove(+id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
