import { CreateUserDto } from "../../dto/create-user.dto";
import { Result } from "../../../shared/result";
import { RegistrationError } from "../../../core/error/user-registration.error";
import { User } from "../../../core/entities/user.entity";
import { UserStatus, UserUniqKeys } from "../../../core/enum/user.enum";
import { UpdateUserDto } from "../../dto/update-user.dto";
import { ActionStatus } from "../../../core/enum/action-status";

export interface UserRepositoryInteface {
  create(user: CreateUserDto): Promise<Result<string, RegistrationError>>;
  findAll(): Promise<User[]>;
  findUserByUniqKey(key: UserUniqKeys, value: string): Promise<User | null>;
  findUserListByUniqKey(key: UserUniqKeys, values: string[]): Promise<User[]>;
  updateStatusAndRemoveValidationToken(
    userId: string,
    userStatus: UserStatus
  ): Promise<ActionStatus>;
  update(userId: string, updateUser: UpdateUserDto): Promise<ActionStatus>;
}
