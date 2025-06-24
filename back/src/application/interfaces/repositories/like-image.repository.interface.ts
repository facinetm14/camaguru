import { UserImageLike } from "../../../core/entities/user-image-like.entity";

export interface LikeImageRepositoryInterface {
  create(authorId: string, imageId: string): Promise<UserImageLike>;
  findAllByIdMage(imageId: string): Promise<UserImageLike[]>;
  findAllByIdMageAndAuthorId(
    imageId: string,
    authorId: string
  ): Promise<UserImageLike>;
  delete(id: string): Promise<void>;
}
