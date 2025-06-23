import { ActionStatus } from "../../../core/enum/action-status";
import { UserSessionRepositoryInterface } from "../../interfaces/repositories/user-session.repository.interface";

export class LogoutUserUseCase {
  constructor(
    private readonly userSessionRepo: UserSessionRepositoryInterface
  ) {}

  execute(sessionId: string): Promise<ActionStatus> {
    return this.userSessionRepo.delete(sessionId);
  }
}
