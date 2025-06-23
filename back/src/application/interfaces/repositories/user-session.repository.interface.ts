import { UserSession } from "../../../core/entities/user-session.entity";
import { ActionStatus } from "../../../core/enum/action-status";
import { UserLoginError } from "../../../core/error/user-login.error";
import { Result } from "../../../shared/result";
import { CreateUserSessionDto } from "../../dto/create-user-session.dto";

export interface UserSessionRepositoryInterface {
  create(
    createUserSessionDto: CreateUserSessionDto
  ): Promise<Result<UserSession, UserLoginError>>;
  findById(id: string): Promise<UserSession | null>;
  delete(id: string): Promise<ActionStatus>;
}
