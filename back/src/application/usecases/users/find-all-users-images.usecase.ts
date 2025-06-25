import { UserImageHeavy } from "../../../core/entities/user-image-heavy.entity";
import { UserImage } from "../../../core/entities/user-image.entity";
import { UserImagesRepositoryInteface } from "../../interfaces/repositories/user-image.repository.inteface";

export class FindAllUsersImagesUseCase {
  constructor(private readonly userImageRepo: UserImagesRepositoryInteface) {}

  execute(userId: string): Promise<UserImageHeavy[]> {
    return this.userImageRepo.findAllByUser(userId);
  }
}
