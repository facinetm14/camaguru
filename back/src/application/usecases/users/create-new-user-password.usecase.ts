import { ActionStatus } from "../../../core/enum/action-status";
import { CreateNewUserPasswordDto } from "../../dto/reset-password.dto";
import { omit } from "../../../shared/omit-object-properties";
import { UserStatus, UserUniqKeys } from "../../../core/enum/user.enum";
import { canChangePassword } from "../../utils/user.utils";
import { UserRepositoryInteface } from "../../ports/repositories/user.repository.interface";

export class CreateNewUserPasswordUseCase {
  constructor(private readonly userRepo: UserRepositoryInteface) {}

  async execute(
    createNewUserPasswordDto: CreateNewUserPasswordDto
  ): Promise<ActionStatus> {
    const user = await this.userRepo.findUserByUniqKey(
      UserUniqKeys.ID,
      createNewUserPasswordDto.id
    );

    if (!user || !canChangePassword(user)) {
      return ActionStatus.FAILED;
    }

    const updateUser = {
      ...omit(createNewUserPasswordDto, ["id"]),
      status: UserStatus.VERIFIED,
    };

    return this.userRepo.update(createNewUserPasswordDto.id, updateUser);
  }
}
