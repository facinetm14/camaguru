import { UserImageLike } from "../../../core/entities/user-image-like.entity";
import { LikeImageError } from "../../../core/error/like-image.error";
import { Result } from "../../../shared/result";

export interface LikeImageRepositoryInterface {
  create(
    authorId: string,
    imageId: string
  ): Promise<Result<UserImageLike, LikeImageError.UNKNOWN_ERROR>>;
  findAllByIdMage(imageId: string): Promise<UserImageLike[]>;
  findAllByIdMageAndAuthorId(
    imageId: string,
    authorId: string
  ): Promise<UserImageLike | null>;
  delete(id: string): Promise<void>;
}
