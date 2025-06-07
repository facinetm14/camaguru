import { User } from "../entity/User";
import { CreateUserDto } from "../dtos/createUserDto";
import { LoginUserDto } from "../dtos/loginUserDto";
import { RegistrationError } from "../utils/errors/user-registration.error";
import { Result, ResultWithOutData } from "../utils/validation/result";
import { UserLoginError } from "../utils/errors/user-login.error";
import { UserVerificationError } from "../utils/errors/user-verificatio.error";
import { ResetPasswordDto } from "../dtos/resetPasswordDtot";

export enum UserVeryficationStatus {
  OK = "OK",
  ERROR = "ERROR",
}
export interface AuthService {
  register(
    createUserDto: CreateUserDto
  ): Promise<Result<User, RegistrationError>>;
  verify(token: string): Promise<Result<string, UserVerificationError>>;
  signin(loginUserDto: LoginUserDto): Promise<Result<string, UserLoginError>>;
  resetPassword(email: string): Promise<string | null>;
  createNewPassword(newPassword: ResetPasswordDto): Promise<ResultWithOutData>;
}
