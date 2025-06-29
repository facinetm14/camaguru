import { User } from "../../../core/entities/user.entity";
import { UserUniqKeys } from "../../../core/enum/user.enum";
import { UserSessionRepositoryInterface } from "../../ports/repositories/user-session.repository.interface";
import { UserRepositoryInteface } from "../../ports/repositories/user.repository.interface";

export class FindUserInfosUseCase {
  constructor(
    private readonly userRepo: UserRepositoryInteface,
    private readonly userSessionRepo: UserSessionRepositoryInterface
  ) {}

  async execute(value: string, key?: UserUniqKeys): Promise<User | null> {
    if (key) {
      return this.userRepo.findUserByUniqKey(key, value);
    }

    const userSession = await this.userSessionRepo.findById(value);
    if (!userSession) {
      return null;
    }

    return this.userRepo.findUserByUniqKey(UserUniqKeys.ID, userSession.userId);
  }
}
