import { UserUniqKeys } from "../../../core/enum/user.enum";
import { UpdateUserInfosError } from "../../../core/error/update-user-infos.error";
import { isValidEmail } from "../../../shared/email-validator";
import { hashPassword, isPasswordStrong } from "../../../shared/password";
import { Err, Ok, Result } from "../../../shared/result";
import { UpdateUserDto } from "../../dto/update-user.dto";
import { UserRepositoryInteface } from "../../ports/repositories/user.repository.interface";

export class UpdateUserInfosUseCase {
  constructor(private userRepo: UserRepositoryInteface) {}

  async execute(
    userId: string,
    updateUserDto: UpdateUserDto
  ): Promise<Result<null, UpdateUserInfosError>> {
    if (updateUserDto.username) {
      const user = await this.userRepo.findUserByUniqKey(
        UserUniqKeys.USER_NAME,
        updateUserDto.username
      );

      if (user) {
        return Err(UpdateUserInfosError.USER_NAME_ALREADY_EXISTS);
      }
    }

    if (updateUserDto.email) {
      if (!isValidEmail(updateUserDto.email)) {
        return Err(UpdateUserInfosError.INVALID_USER_EMAIL);
      }

      const user = await this.userRepo.findUserByUniqKey(
        UserUniqKeys.EMAIL,
        updateUserDto.email
      );

      if (user) {
        return Err(UpdateUserInfosError.USER_EMAIL_ALREADY_EXITS);
      }
    }

    if (updateUserDto.passwd) {
      if (!isPasswordStrong(updateUserDto.passwd)) {
        return Err(UpdateUserInfosError.USER_PASSWD_WEAK);
      }

      const { hash, salt } = await hashPassword(updateUserDto.passwd);
      await this.userRepo.update(userId, {
        ...updateUserDto,
        passwd: hash,
        salt,
      });
      return Ok(null);
    }

    await this.userRepo.update(userId, updateUserDto);
    return Ok(null);
  }
}
