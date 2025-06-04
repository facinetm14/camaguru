import { UserUniqKeys } from "../enums/user.enums";
import { User } from "../entity/User";
import { CreateUserDto } from "../dtos/createUserDto";
import { UploadImageDto } from "../dtos/uploadImageDto";
import { Result } from "../utils/validation/result";
import { uploadImageError } from "../utils/errors/upload-image.error";
import { GetImageError } from "../utils/errors/get-image.error";

export interface UserService {
  findAll(): Promise<User[]>;
  create(
    createUserDto: CreateUserDto,
    validationToken: string
  ): Promise<User | null>;
  findUserByUniqKey(key: UserUniqKeys, value: string): Promise<User | null>;
  activateAccount(idUser: string): Promise<void>;
  // uploadImage(
  //   imageDto: UploadImageDto
  // ): Promise<Result<null, uploadImageError>>;
  //getImage(filename: string): Result<string, GetImageError>;
}
