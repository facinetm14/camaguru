import { CommentImageDto } from "../../dto/comment-image.dto";

export interface CommentImageRepositoryInterface {
  create(commentImageDto: CommentImageDto): Promise<void>;
}