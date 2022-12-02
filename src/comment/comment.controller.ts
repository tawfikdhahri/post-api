import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReactToCommentRequestDto } from './dto/react-comment-request.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  create(@Body() createCommentDto: CreateCommentDto, @Req() request: Request) {
    const user = request.user;
    try {
      return this.commentService.create(user, createCommentDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('reaction/:commentId')
  reactToComment(
    @Body() reactToCommentRequestDto: ReactToCommentRequestDto,
    @Req() request: any,
    @Param('commentId') commentId: string,
  ) {
    try {
      return this.commentService.reactToComment(
        commentId,
        reactToCommentRequestDto,
        request.user,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  @Get(':postId')
  findCommentsByPostId(@Param('postId') postId: string) {
    return this.commentService.findCommentsByPostId(postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findById(id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
