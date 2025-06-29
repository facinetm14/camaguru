import { ActionStatus } from "../../../core/enum/action-status";
import { DeleteUserImageError } from "../../../core/error/delete-image.error";
import { Err, Ok, Result } from "../../../shared/result";
import { UserImagesRepositoryInteface } from "../../ports/repositories/user-image.repository.inteface";

export class DeleteUserImageUseCase {
  constructor(private readonly userImageRepo: UserImagesRepositoryInteface) {}

  async execute(
    imageId: string,
    userId: string
  ): Promise<Result<string, DeleteUserImageError>> {
    const image = await this.userImageRepo.find(imageId);
    if (!image) {
      return Err(DeleteUserImageError.IMAGE_NOT_FOUND);
    }

    if (image.userId !== userId) {
      return Err(DeleteUserImageError.USER_NOT_IMAGE_AUTHOR);
    }

    const status = await this.userImageRepo.delete(imageId);
    if (status === ActionStatus.FAILED) {
      return Err(DeleteUserImageError.UNKNOWN_ERROR);
    }
    return Ok(image.name);
  }
}
