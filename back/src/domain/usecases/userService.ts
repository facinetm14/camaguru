import { UserUniqKeys } from "../enums/user.enums";
import { User } from "../entity/User";
import { CreateUserDto } from "../dtos/createUserDto";
import { UserImage } from "../entity/userImage";
import { UpdateUserDto } from "../dtos/updateUserDto";

export interface UserService {
  findAll(): Promise<User[]>;
  create(
    createUserDto: CreateUserDto,
    validationToken: string
  ): Promise<User | null>;
  findUserByUniqKey(key: UserUniqKeys, value: string): Promise<User | null>;
  activateAccount(idUser: string): Promise<void>;
  saveImage(userId: string, filename: string): Promise<void>;
  findAllImages(): Promise<UserImage[]>;
  update(idUser: string, updateUserDto: UpdateUserDto): Promise<string | null>;
}
