import { ActionStatus } from "../../../core/enum/action-status";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { CreateNewUserPasswordDto } from "../../dto/reset-password.dto";

export class CreateNewUserPasswordUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  execute(
    createNewUserPasswordDto: CreateNewUserPasswordDto
  ): Promise<ActionStatus> {
    return this.userRepo.update(
      createNewUserPasswordDto.id,
      omit(createNewUserPasswordDto, ["id"])
    );
  }
}
