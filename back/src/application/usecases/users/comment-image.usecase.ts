import { EmailSubject } from "../../../core/enum/email-subject";
import {
  CommentNotificationStatus,
  UserUniqKeys,
} from "../../../core/enum/user.enum";
import { CommentImageError } from "../../../core/error/comment-image.error";
import { Err, Ok, Result } from "../../../shared/result";
import { CommentNotificationTemplate } from "../../../template/email";
import { CommentImageDto } from "../../dto/comment-image.dto";
import { CommentImageRepositoryInterface } from "../../ports/repositories/comment-image.repository.interface";
import { UserImagesRepositoryInteface } from "../../ports/repositories/user-image.repository.inteface";
import { UserRepositoryInteface } from "../../ports/repositories/user.repository.interface";
import {
  Email,
  EmailServiceInterface,
} from "../../ports/services/email.service.interface";

export class CommentImageUseCase {
  constructor(
    private readonly imageRepo: UserImagesRepositoryInteface,
    private readonly commentImageRepo: CommentImageRepositoryInterface,
    private readonly userRepo: UserRepositoryInteface,
    private readonly emailService: EmailServiceInterface
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
      const userList = await this.userRepo.findUserListByUniqKey(
        UserUniqKeys.ID,
        [image.userId, commentImageDto.authorId]
      );
      if (userList.length !== 2) {
        return Ok(null);
      }

      let imageAuthor;
      let commentAuthor;

      if (userList[0].id === image.userId) {
        imageAuthor = userList[0];
        commentAuthor = userList[1];
      } else {
        imageAuthor = userList[1];
        commentAuthor = userList[0];
      }

      if (
        imageAuthor.commentNotification === CommentNotificationStatus.ACITIVE
      ) {
        const email: Email = {
          to: imageAuthor.email,
          subject: EmailSubject.IMAGE_COMMENT,
          msg: CommentNotificationTemplate(
            imageAuthor.username,
            {
              authorName: commentAuthor.username,
              content: commentImageDto.comment,
            },
            commentImageDto.imageId
          ),
        };
        await this.emailService.send(email);
      }
      return Ok(null);
    } catch (error) {
      console.error(error);
      return Err(CommentImageError.UNKNOWN_ERROR);
    }
  }
}
