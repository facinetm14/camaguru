import { CommentImageError } from "../../../core/error/comment-image.error";
import { CommentImageRepository } from "../../../infrastructure/repositories/comment-image.repository";
import { UserImageRepository } from "../../../infrastructure/repositories/user-image.repository";
import { EmailService } from "../../../infrastructure/services/email.service";
import { Err, Ok, Result } from "../../../shared/result";
import { CommentImageDto } from "../../dto/comment-image.dto";

export class CommentImageUseCase {
  constructor(
    private readonly imageRepo: UserImageRepository,
    private readonly commentImageRepo: CommentImageRepository,
    private readonly emailService: EmailService
  ) {}

  async execute(
    commentImageDto: CommentImageDto
  ): Promise<Result<null, CommentImageError>> {
    const image = await this.imageRepo.find(commentImageDto.imageId);
    if (!image) {
      return Err(CommentImageError.IMAGE_NOT_FOUND);
    }
    try {
      await this.commentImageRepo.create(commentImageDto);
      return Ok(null);
    } catch (error) {
      console.log(error);
      return Err(CommentImageError.UNKNOWN_ERROR);
    }
  }
}
