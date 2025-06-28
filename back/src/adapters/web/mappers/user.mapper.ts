import { CreateUserDto } from "../../../application/dto/create-user.dto";
import { LoginUserDto } from "../../../application/dto/login-user.dto";
import { CreateNewUserPasswordDto } from "../../../application/dto/reset-password.dto";
import { UpdateUserDto } from "../../../application/dto/update-user.dto";
import { User } from "../../../core/entities/user.entity";
import {
  CommentNotificationStatus,
  UserStatus,
} from "../../../core/enum/user.enum";
import { UserLoginError } from "../../../core/error/user-login.error";
import { RegistrationError } from "../../../core/error/user-registration.error";
import {
  UserModel,
  UserModelForUpdate,
} from "../../../infrastructure/model/user.model";
import { isValidEmail } from "../../../shared/email-validator";
import { hashPassword, isPasswordStrong } from "../../../shared/password";
import { Err, Ok, Result } from "../../../shared/result";
import { isNotEmptyString } from "../../../shared/string";
import { uuid } from "../../../shared/uuid";

export const buildCreateUserDtoFromRequestBody = async (
  body: any
): Promise<Result<CreateUserDto, RegistrationError>> => {
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

  const { hash, salt } = await hashPassword(body.passwd);

  return Ok({
    id: uuid(),
    username: body.username,
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    adress: body.adress,
    passwd: hash,
    validationToken: uuid(),
    salt,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: UserStatus.UNVERIFIED,
    commentNotification: CommentNotificationStatus.ACITIVE,
  });
};

export const buildUserModelFromCreateUserDto = async (
  createUserDto: CreateUserDto
): Promise<UserModel> => {
  return {
    id: createUserDto.id,
    username: createUserDto.username,
    email: createUserDto.email,
    adress: createUserDto.adress,
    first_name: createUserDto.firstName,
    last_name: createUserDto.lastName,
    passwd: createUserDto.passwd,
    salt: createUserDto.salt,
    status: createUserDto.status,
    validation_token: createUserDto.validationToken,
    created_at: createUserDto.createdAt,
    updated_at: createUserDto.updatedAt,
    comment_notification: createUserDto.commentNotification,
  };
};

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
    status: userModel.status,
    salt: userModel.salt,
    validationToken: userModel.validation_token,
    commentNotification: userModel.comment_notification,
  };
}

export const buildUserModelForUpdateFormDto = (
  updateUser: UpdateUserDto
): UserModelForUpdate => {
  return {
    ...(updateUser.adress !== undefined && { adress: updateUser.adress }),
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
    ...(updateUser.status !== undefined && {
      status: updateUser.status,
    }),
    ...(updateUser.salt !== undefined && {
      salt: updateUser.salt,
    }),
    ...(updateUser.commentNotification !== undefined && {
      comment_notification: updateUser.commentNotification,
    }),
    ...(updateUser.email !== undefined && {
      email: updateUser.email,
    }),
    updated_at: new Date(),
  };
};

export const buildUserLoginDtoFromRequestBody = (
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

export const buildResetPasswordDtoFromRequestBody = (
  body: any
): Result<string, RegistrationError.INVALID_USER_EMAIL> => {
  if (!isNotEmptyString(body.email) || !isValidEmail(body.email)) {
    return Err(RegistrationError.INVALID_USER_EMAIL);
  }

  return Ok(body.email);
};

export const buildCreateNewUserPasswordDto = async (
  body: any
): Promise<Result<CreateNewUserPasswordDto, RegistrationError>> => {
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

export const buildUpdateUserInfosFromUpdateRequest = (
  body: any
): Result<UpdateUserDto, RegistrationError> => {
  for (const [key, value] of Object.entries(body)) {
    if (!value) {
      return Err(RegistrationError.BAD_REQUEST);
    }
  }

  return Ok({
    ...body,
  });
};
