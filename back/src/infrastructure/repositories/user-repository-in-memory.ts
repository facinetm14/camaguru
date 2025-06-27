import { CreateUserDto } from "../../application/dto/create-user.dto";
import { UpdateUserDto } from "../../application/dto/update-user.dto";
import { UserRepositoryInteface } from "../../application/interfaces/repositories/user.repository.interface";
import { User } from "../../core/entities/user.entity";
import { ActionStatus } from "../../core/enum/action-status";
import { UserUniqKeys, UserStatus } from "../../core/enum/user.enum";
import { RegistrationError } from "../../core/error/user-registration.error";
import { Result } from "../../shared/result";

export class UserRepositoryInMemory implements UserRepositoryInteface {
  constructor(private users: User[] = []) {}
  findUserListByUniqKey(key: UserUniqKeys, values: string[]): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  create(user: CreateUserDto): Promise<Result<string, RegistrationError>> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  async findUserByUniqKey(
    key: UserUniqKeys,
    value: string
  ): Promise<User | null> {
    const user = this.users.find((u) => u[key as keyof User] == value);
    return user ?? null;
  }

  updateStatusAndRemoveValidationToken(
    idUser: string,
    userStatus: UserStatus
  ): Promise<ActionStatus> {
    throw new Error("Method not implemented.");
  }
  update(idUser: string, updateUser: UpdateUserDto): Promise<ActionStatus> {
    throw new Error("Method not implemented.");
  }
}
