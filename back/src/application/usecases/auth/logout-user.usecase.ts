import { ActionStatus } from "../../../core/enum/action-status";
import { UserSessionRepositoryInterface } from "../../ports/repositories/user-session.repository.interface";

export class LogoutUserUseCase {
  constructor(
    private readonly userSessionRepo: UserSessionRepositoryInterface
  ) {}

  execute(sessionId: string): Promise<ActionStatus> {
    return this.userSessionRepo.delete(sessionId);
  }
}
