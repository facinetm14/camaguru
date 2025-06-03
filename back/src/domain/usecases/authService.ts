import { User } from "../entity/User";
import { CreateUserDto } from "../dtos/createUserDto";
import { LoginUserDto } from "../dtos/loginUserDto";
import { RegistrationError } from "../utils/errors/user-registration.error";
import { Result, ResultWithOutData } from "../utils/validation/result";
import { UserLoginError } from "../utils/errors/user-login.error";

export enum UserVeryficationStatus {
  OK = "OK",
  ERROR = "ERROR",
}
export interface AuthService {
  register(
    createUserDto: CreateUserDto
  ): Promise<Result<User, RegistrationError>>;
  verify(token: string): Promise<ResultWithOutData>;
  signin(loginUserDto: LoginUserDto): Promise<Result<string, UserLoginError>>;
  resetPassword(email: string): Promise<string | null>;
}
