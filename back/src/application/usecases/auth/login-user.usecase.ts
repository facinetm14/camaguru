import { UserUniqKeys } from "../../../core/enum/user.enum";
import { UserLoginError } from "../../../core/error/user-login.error";
import { verifyPassword } from "../../../shared/password";
import { Result, Err, Ok } from "../../../shared/result";
import { uuid } from "../../../shared/uuid";
import { LoginUserDto } from "../../dto/login-user.dto";
import { UserSessionRepositoryInterface } from "../../interfaces/repositories/user-session.repository.interface";
import { UserRepositoryInteface } from "../../interfaces/repositories/user.repository.interface";
import { isUserVerified } from "../../utils/user.utils";

export class LoginUserUseCase {
  constructor(
    private readonly userRepo: UserRepositoryInteface,
    private readonly userSessionRepo: UserSessionRepositoryInterface
  ) {}

  async execute(
    loginUserDto: LoginUserDto
  ): Promise<Result<string, UserLoginError>> {
    const user = await this.userRepo.findUserByUniqKey(
      UserUniqKeys.USER_NAME,
      loginUserDto.username
    );

    if (!user) {
      return Err(UserLoginError.USER_NOT_FOUND);
    }

    if (!isUserVerified(user)) {
      return Err(UserLoginError.USER_EMAIL_NOT_VERIFIED);
    }

    const checkPassword = await verifyPassword(
      loginUserDto.passwd,
      user.passwd,
      user.salt as string
    );

    if (!checkPassword) {
      return Err(UserLoginError.INVALID_CREDENTIALS);
    }

    const createUserSessionResult = await this.userSessionRepo.create({
      id: uuid(),
      userId: user.id,
    });

    if (createUserSessionResult.isErr) {
      return Err(UserLoginError.UNABLE_TO_CREATE_USER_SESSION);
    }

    return Ok(createUserSessionResult.data.id);
  }
}
