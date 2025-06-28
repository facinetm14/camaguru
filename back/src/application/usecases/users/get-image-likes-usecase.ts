import { UserImageLike } from "../../../core/entities/user-image-like.entity";
import { LikeImageRepositoryInterface } from "../../ports/repositories/like-image.repository.interface";

export class GetImageLikesUseCase {
  constructor(private readonly likeImageRepo: LikeImageRepositoryInterface) {}

  async execute(imageId: string): Promise<UserImageLike[]> {
    return this.likeImageRepo.findAllByIdMage(imageId);
  }
}
