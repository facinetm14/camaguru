import { UserImage } from "../../../core/entities/user-image.entity";
import { UserImagesRepositoryInteface } from "../../interfaces/repositories/user-image.repository.inteface";

export class FindAllUsersImagesUseCase {
  constructor(private readonly userImageRepo: UserImagesRepositoryInteface) {}

  execute(): Promise<UserImage[]> {
    return this.userImageRepo.findAll();
  }
}
