import { UserImageLike } from "../../../core/entities/user-image-like.entity";
import { UserUniqKeys } from "../../../core/enum/user.enum";
import { LikeImageError } from "../../../core/error/like-image.error";
import { LikeImageRepository } from "../../../infrastructure/repositories/like-image.repository";
import { UserImageRepository } from "../../../infrastructure/repositories/user-image.repository";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { Err, Ok, Result } from "../../../shared/result";

export class LikeImageUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly imageRepo: UserImageRepository,
    private readonly likeImageRepo: LikeImageRepository
  ) {}
  async execute(
    authorId: string,
    imageId: string
  ): Promise<Result<UserImageLike | null, LikeImageError>> {
    const user = await this.userRepo.findUserByUniqKey(
      UserUniqKeys.ID,
      authorId
    );
    if (!user) {
      return Err(LikeImageError.UNAUTHORIZED);
    }

    const userImage = await this.imageRepo.find(imageId);
    if (!userImage) {
      return Err(LikeImageError.IMAGE_NOT_FOUND);
    }

    const like = await this.likeImageRepo.findAllByIdMageAndAuthorId(
      imageId,
      authorId
    );

    if (like) {
      await this.likeImageRepo.delete(like.id);
      return Ok(null);
    }

    const newLike = await this.likeImageRepo.create(authorId, imageId);
    return Ok(newLike);
  }
}
