
import { CreateUserDto } from "../../dto/create-user.dto";
import { Result } from "../../../shared/result";
import { RegistrationError } from "../../../core/error/user-registration.error";
import { User } from "../../../core/entities/user.entity";
import { UserUniqKeys } from "../../../core/enum/user.enum";
import { UpdateUserDto } from "../../dto/update-user.dto";
import { ActionStatus } from "../../../core/enum/action-status";

export interface UserRepositoryInteface {
  create(user: CreateUserDto): Promise<Result<User, RegistrationError>>;
  findAll(): Promise<User[]>;
  findUserByUniqKey(key: UserUniqKeys, value: string): Promise<User | null>;
  updateStatusAndRemoveValidationToken(idUser: string): Promise<ActionStatus>;
  update(idUser: string, updateUser: UpdateUserDto): Promise<ActionStatus>;
}
