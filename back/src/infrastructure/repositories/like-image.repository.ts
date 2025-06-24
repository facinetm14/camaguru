import { LikeImageRepositoryInterface } from "../../application/interfaces/repositories/like-image.repository.interface";
import { UserImageLike } from "../../core/entities/user-image-like.entity";

export class LikeImageRepository implements LikeImageRepositoryInterface {
  create(authorId: string, imageId: string): Promise<UserImageLike> {
    throw new Error("Method not implemented.");
  }
  findAllByIdMage(imageId: string): Promise<UserImageLike[]> {
    throw new Error("Method not implemented.");
  }
  findAllByIdMageAndAuthorId(
    imageId: string,
    authorId: string
  ): Promise<UserImageLike | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
