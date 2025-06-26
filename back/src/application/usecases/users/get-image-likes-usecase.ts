import { UserImageLike } from "../../../core/entities/user-image-like.entity";
import { LikeImageRepository } from "../../../infrastructure/repositories/like-image.repository";

export class GetImageLikesUseCase {
  constructor(private readonly likeImageRepo: LikeImageRepository) {}

  async execute(imageId: string): Promise<UserImageLike[]> {
    return this.likeImageRepo.findAllByIdMage(imageId);
  }
}
