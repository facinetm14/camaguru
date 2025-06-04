import { UserUniqKeys } from "../enums/user.enums";
import {
  buildUserEntityFromModel,
  buildUserListFromRawModel,
  buildUserModelFromCreateUserDto,
} from "../utils/mappers/user-entity.mapper";

import { User } from "../entity/User";
import { UserRepository } from "../ports/userRepository";
import { CreateUserDto } from "../dtos/createUserDto";
import { UserService } from "../usecases/userService";
import { UploadImageDto } from "../dtos/uploadImageDto";
import { Err, Ok, Result } from "../utils/validation/result";
import { join, resolve } from "node:path";
import { UPLOAD_DEST } from "../utils/consts";
import { uploadImageError } from "../utils/errors/upload-image.error";
import { readFile, writeFile } from "node:fs/promises";
import { GetImageError } from "../utils/errors/get-image.error";

export class UserConCreteService implements UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    const userRawList = await this.userRepository.findAll();
    if (!userRawList) {
      return [];
    }
    return buildUserListFromRawModel(userRawList);
  }

  async create(
    createUserDto: CreateUserDto,
    validationToken: string
  ): Promise<User | null> {
    const newUser = await buildUserModelFromCreateUserDto(
      createUserDto,
      validationToken
    );
    try {
      const createdUser = await this.userRepository.create(newUser);
      return buildUserEntityFromModel(createdUser);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findUserByUniqKey(
    key: UserUniqKeys,
    value: string
  ): Promise<User | null> {
    const user = await this.userRepository.findUserByUniqKey(key, value);
    if (!user) {
      return null;
    }
    return buildUserEntityFromModel(user);
  }

  async activateAccount(idUser: string): Promise<void> {
    return this.userRepository.updateStatusAndRemoveValidationToken(idUser);
  }

  // async uploadImage(
  //   imageDto: UploadImageDto
  // ): Promise<Result<null, uploadImageError>> {
  //   try {
  //     const path = join(process.cwd(), UPLOAD_DEST, imageDto.filename);
  //     await writeFile(path, Buffer.from(imageDto.image, "base64"));
  //     return Ok(null);
  //   } catch (_error) {
  //     return Err(uploadImageError.UNKNOWN_ERROR);
  //   }
  // }
  //   async getImage(filename: string): Result<string, GetImageError> {
  //     const
  //   }
  // }
}
