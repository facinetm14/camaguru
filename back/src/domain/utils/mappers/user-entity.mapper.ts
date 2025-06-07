import { CreateSessionDto } from "../../dtos/createSessionDto";
import { CreateUserDto } from "../../dtos/createUserDto";
import { User } from "../../entity/User";
import {
  UpdateUserModel,
  UserModel,
} from "../../../infrastructure/model/UserModel";
import { UserStatus } from "../../enums/user.enums";
import { hashPassword, isPasswordStrong } from "../password";
import { uuid } from "../uuid";
import { isValidEmail } from "../validation/email";
import { isNotEmptyString } from "../validation/string";
import { LoginUserDto } from "../../dtos/loginUserDto";
import { RegistrationError } from "../errors/user-registration.error";
import { UserLoginError } from "../errors/user-login.error";
import { Err, Ok, Result } from "../validation/result";
import { uploadImageError } from "../errors/upload-image.error";
import { UploadImageDto } from "../../dtos/uploadImageDto";
import { UpdateUserDto } from "../../dtos/updateUserDto";
import { ResetPasswordDto } from "../../dtos/resetPasswordDtot";

export function buildUserListFromRawModel(userRawList: UserModel[]): User[] {
  return userRawList.map((userRaw) => buildUserEntityFromModel(userRaw));
}

export function buildUserEntityFromModel(userModel: UserModel): User {
  return {
    id: userModel.id,
    username: userModel.username,
    updatedAt: userModel.updated_at,
    createdAt: userModel.created_at,
    firstName: userModel.first_name,
    lastName: userModel.last_name,
    email: userModel.email,
    adress: userModel.adress,
    passwd: userModel.passwd,
    salt: userModel.salt,
    status: userModel.status,
  };
}

export const buildUserModelFromCreateUserDto = async (
  createUserDto: CreateUserDto,
  validationToken: string
): Promise<UserModel> => {
  const { hash, salt } = await hashPassword(createUserDto.passwd);
  return {
    id: uuid("user"),
    username: createUserDto.username,
    email: createUserDto.email,
    adress: createUserDto.adress,
    first_name: createUserDto.firstName,
    last_name: createUserDto.lastName,
    passwd: hash,
    salt,
    status: UserStatus.UNVERIFIED,
    validation_token: validationToken,
    created_at: new Date(),
    updated_at: new Date(),
  };
};

export const parseRequestBodyAndBuildCreateUserDto = (
  body: any
): Result<CreateUserDto, RegistrationError> => {
  if (!isNotEmptyString(body.username)) {
    return Err(RegistrationError.INVALID_USER_NAME);
  }

  if (!isNotEmptyString(body.email) || !isValidEmail(body.email)) {
    return Err(RegistrationError.INVALID_USER_EMAIL);
  }

  if (!isNotEmptyString(body.adress)) {
    return Err(RegistrationError.INVALID_ADRESS);
  }

  if (!isNotEmptyString(body.firstName)) {
    return Err(RegistrationError.INVALID_USER_FIRST);
  }

  if (!isNotEmptyString(body.lastName)) {
    return Err(RegistrationError.INVALID_USER_LAST);
  }

  if (!isNotEmptyString(body.passwd)) {
    return Err(RegistrationError.INVALID_USER_PASSWD);
  }

  if (!isPasswordStrong(body.passwd)) {
    return Err(RegistrationError.USER_PASSWD_WEAK);
  }

  return Ok({
    username: body.username,
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    adress: body.adress,
    passwd: body.passwd,
  });
};

export const parseRequestBodyAndBuildLoginUserDto = (
  body: any
): Result<LoginUserDto, UserLoginError> => {
  if (!isNotEmptyString(body.username)) {
    return Err(UserLoginError.INVALID_USER_NAME);
  }

  if (!isNotEmptyString(body.passwd)) {
    return Err(UserLoginError.INVALID_USER_PASSWD);
  }

  return Ok({
    username: body.username,
    passwd: body.passwd,
  });
};

export const parseRequestBodyAndBuildUploadImageDto = (
  body: any
): Result<UploadImageDto, uploadImageError> => {
  if (!isNotEmptyString(body.filename)) {
    return Err(uploadImageError.INVALID_FILE_NAME);
  }

  if (!isNotEmptyString(body.image)) {
    return Err(uploadImageError.INVALID_IMAGE);
  }

  return Ok({ filename: body.filename, image: body.image });
};

export const parseAndValidateEmail = (
  body: any
): Result<string, RegistrationError.INVALID_USER_EMAIL> => {
  if (!isNotEmptyString(body.email) || !isValidEmail(body.email)) {
    return Err(RegistrationError.INVALID_USER_EMAIL);
  }

  return Ok(body.email);
};

export const buildUpdateUserModelFormDto = (
  updateUser: UpdateUserDto
): UpdateUserModel => {
  return {
    ...(updateUser.adress !== undefined && { adres: updateUser.adress }),
    ...(updateUser.firstName !== undefined && {
      first_name: updateUser.firstName,
    }),
    ...(updateUser.lastName !== undefined && {
      last_name: updateUser.lastName,
    }),
    ...(updateUser.username !== undefined && { username: updateUser.username }),
    ...(updateUser.passwd !== undefined && { passwd: updateUser.passwd }),
    ...(updateUser.validationToken !== undefined && {
      validation_token: updateUser.validationToken,
    }),
    updated_at: new Date(),
  };
};

export const parseAndValidateResetPasswordDto = async (
  body: any
): Promise<Result<ResetPasswordDto, RegistrationError>> => {
  if (!isNotEmptyString(body.id) || !isNotEmptyString(body.passwd)) {
    return Err(RegistrationError.BAD_REQUEST);
  }

  if (!isPasswordStrong(body.passwd)) {
    return Err(RegistrationError.USER_PASSWD_WEAK);
  }

  const { hash, salt } = await hashPassword(body.passwd);
  return Ok({
    id: body.id,
    passwd: hash,
    salt,
  });
};
