import { User } from "../../../core/entities/user.entity";
import { UserRepositoryInteface } from "../../interfaces/repositories/user.repository.interface";

export class FindAllUsersUseCas {
  constructor(private readonly userRepo: UserRepositoryInteface) {}

  async execute(): Promise<User[]> {
    return this.userRepo.findAll();
  }
}
