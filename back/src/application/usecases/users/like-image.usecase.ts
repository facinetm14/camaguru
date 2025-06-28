import { UserImageLike } from "../../../core/entities/user-image-like.entity";
import { LikeImageError } from "../../../core/error/like-image.error";
import { Err, Ok, Result } from "../../../shared/result";
import { LikeImageRepositoryInterface } from "../../ports/repositories/like-image.repository.interface";
import { UserImagesRepositoryInteface } from "../../ports/repositories/user-image.repository.inteface";

export class LikeImageUseCase {
  constructor(
    private readonly imageRepo: UserImagesRepositoryInteface,
    private readonly likeImageRepo: LikeImageRepositoryInterface
  ) {}
  async execute(
    authorId: string,
    imageId: string
  ): Promise<Result<UserImageLike | null, LikeImageError>> {
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

    if (newLike.isErr) {
      return Err(LikeImageError.UNKNOWN_ERROR);
    }

    return Ok(newLike.data);
  }
}
