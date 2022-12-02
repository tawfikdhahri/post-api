import { Length } from 'class-validator';

export class CreatePostDto {
  @Length(15, 100)
  text: string;
  image: string;
}
