import { UserImagesRepositoryInteface } from "../../interfaces/repositories/user-image.repository.inteface";

export class SaveUserImageUseCase {
  constructor(private readonly userImageRepo: UserImagesRepositoryInteface) {}

  execute(userId: string, filename: string): Promise<void> {
    return this.userImageRepo.saveImage({ userId, filename });
  }
}
