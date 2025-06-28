import { hashPassword } from "../../../shared/password";
import { UpdateUserDto } from "../../dto/update-user.dto";
import { UserRepositoryInteface } from "../../ports/repositories/user.repository.interface";

export class UpdateUserInfosUseCase {
  constructor(private userRepo: UserRepositoryInteface) {}

  async execute(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
    if (updateUserDto.passwd) {
      const { hash, salt } = await hashPassword(updateUserDto.passwd);
      await this.userRepo.update(userId, {
        ...updateUserDto,
        passwd: hash,
        salt,
      });
      return;
    }

    await this.userRepo.update(userId, updateUserDto);
  }
}
