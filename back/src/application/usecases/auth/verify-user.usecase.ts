import { UserStatus, UserUniqKeys } from "../../../core/enum/user.enum";
import { UserVerificationError } from "../../../core/error/user-verificatio.error";
import { Err, Ok, Result } from "../../../shared/result";
import { UserRepositoryInteface } from "../../interfaces/repositories/user.repository.interface";

export class VerifyUserUseCase {
  constructor(private readonly userRepo: UserRepositoryInteface) {}

  async execute(token: string): Promise<Result<string, UserVerificationError>> {
    const userByToken = await this.userRepo.findUserByUniqKey(
      UserUniqKeys.VALIDATION_TOKEN,
      token
    );

    if (!userByToken) {
      console.log(`Error: Invalid user token`);
      return Err(UserVerificationError.INVALID_TOKEN);
    }

    if (userByToken.status !== UserStatus.VERIFIED) {
      await this.userRepo.updateStatusAndRemoveValidationToken(userByToken.id);
    }

    return Ok(userByToken.id);
  }
}
