import { SaveImageDto } from "../../dto/save-user-image.dto";
import { UserImagesRepositoryInteface } from "../../interfaces/repositories/user-image.repository.inteface";

export class SaveUserImageUseCase {
  constructor(private readonly userImageRepo: UserImagesRepositoryInteface) {}

  async execute(saveImageDto: SaveImageDto): Promise<void> {
    return this.userImageRepo.saveImage(saveImageDto);
  }
}
