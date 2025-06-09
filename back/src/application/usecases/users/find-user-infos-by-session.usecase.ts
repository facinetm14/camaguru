import { User } from "../../../core/entities/user.entity";
import { UserUniqKeys } from "../../../core/enum/user.enum";
import { UserSessionRepositoryInterface } from "../../interfaces/repositories/user-session.repository.interface";
import { UserRepositoryInteface } from "../../interfaces/repositories/user.repository.interface";

export class FindUserInfosByIdSessionUsecase {
  constructor(
    private readonly userRepo: UserRepositoryInteface,
    private readonly userSessionRepo: UserSessionRepositoryInterface
  ) {}

  async execute(sessionId: string): Promise<User | null> {
    const userSession = await this.userSessionRepo.findById(sessionId);
    if (!userSession) {
      return null;
    }

    return this.userRepo.findUserByUniqKey(UserUniqKeys.ID, userSession.id);
  }
}
