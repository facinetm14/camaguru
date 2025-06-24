import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { hashPassword } from "../../../shared/password";
import { UpdateUserDto } from "../../dto/update-user.dto";

export class UpdateUserInfosUseCase {
  constructor(private userRepo: UserRepository) {}

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
